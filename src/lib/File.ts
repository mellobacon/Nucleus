import { dialog, fs, path } from "@tauri-apps/api";
import { get, writable } from 'svelte/store';
import { tabs, addEditorTab } from "./EditorTabList.svelte";
import { filetree } from "./FileTree.svelte";
import { Command } from '@tauri-apps/api/shell';

export async function openFile() {
    let newPath = await dialog.open() as string;
    if (newPath === null) return;
    let filename = newPath.split(path.sep).pop();
    addEditorTab(newPath, filename);
}

export const workspaceName = writable("Untitled Workspace");
export async function openFolder() {
    let directory = await dialog.open({directory: true}) as string;
    if (!directory) return;

    let tree: any = await fs.readDir(directory, {recursive: true});
    if (!tree) {
        console.error("Cannot load directory");
        return;
    }
    let directoryName = directory.split(path.sep).pop();
    tree = [{id: -1, name: directoryName, path: directory, children: buildTree(sortTree(tree))}];
    filetree.set(tree);
    workspaceName.set(directoryName);
    id = 0;
}

// Need to add ids to each node for svelte to iterate over them properly
let id = 0;
function buildTree(tree: fs.FileEntry[]) {
    const nodes = [];
    for (const node of tree) {
        const entry = {id: id, name: node.name, path: node.path, children: node.children};
        id++;
        if (node.children) {
            entry.children = buildTree(sortTree(node.children));
        }
        nodes.push(entry);
    }
    return nodes;
}
function sortTree(tree: fs.FileEntry[]) {
    const sortedTree = [];
    let files = [];
    for (const node of tree) {
        if (node.children) {
            sortedTree.push(node)
            sortTree(node.children);
        }
        else {
            files.push(node);
        }
    }
    files.sort((a, b) => (a - b));
    sortedTree.sort((a, b) => (a - b));
    sortedTree.push(...files);
    return sortedTree;
}

export async function moveFile(source: string, dest: string, file: string, type: string) {

    if (!await dialog.confirm(`Are you sure you want to move "${file.split(path.sep).pop()}" from "./${source.split(path.sep).pop()}" into "./${dest.split(path.sep).pop()}?"`, {title: "Nucleus: Move File"})) {
        return;
    }

    try {
        await fs.renameFile(source, dest);
    } catch (error) {
        console.error(error);
    }

    /*
    // Should use this as fallback
    fs.copyFile(source, dest);
    if (type === "directory") {
        fs.removeDir(source);
    }
    else {
        fs.removeFile(source);
    }
    */
}

export async function saveFile(saveAs = false) {
    const tab = get(tabs).find(t => t.active && t.isfile);
    if (!tab.path.includes(path.sep) || tab.path === "" || saveAs) {
        let newPath = await dialog.save({defaultPath: `${tab.label}.txt`});
        if (newPath === null) return;

        tab.path = newPath;
        tab.label = newPath.split(path.sep).pop();
    }
    // write changes to the file
    fs.writeFile(tab.path, tab.content.getFileContent());
    const fileType = await path.extname(tab.path);
    tab.content.updateFileInfo({
        "filename": tab.label,
        "path": tab.path,
        "fileType": fileType,
        "language": tab.content.getLang(fileType),
        "readonly": false,
    });
    tab.setActive(tab.id);
    updateSaveState(true);
}

export function updateSaveState(saved = true) {
    const tab = get(tabs).find(t => t.active && t.isfile);
    if (saved) {
        tab.saved = true;
        return; // prevents this being fired on every state check
    }
    else {
        tab.saved = false;
    }
    tab.setActive(tab.id);
}

export async function openInExplorer(path) {
    const explorer = new Command("explorer", path);
    try {
        await explorer.spawn();
    } catch (error) {
        console.error(error);
    }
}