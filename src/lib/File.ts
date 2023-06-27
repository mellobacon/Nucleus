import { dialog, fs, path, invoke, window } from "@tauri-apps/api";
import { get, writable } from 'svelte/store';
import { tabs, addEditorTab, renameTab } from "./EditorTabList.svelte";
import { filetree } from "./FileTree.svelte";
import { watch } from "tauri-plugin-fs-watch-api";

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

    // if file path is not in the configured scope already, add it
    // TODO: should configure this so it doesnt access restricted paths based on user permissions
    await invoke("attempt_file_access", {app_handle: window, p: directory});

    const directoryName = await updateTree(directory);
    workspaceName.set(directoryName);

    // load file watcher
    await watch(
        directory,
        async () => {
            await updateTree(directory);
        },
        { recursive: true }
    )
}

async function updateTree(directory) {
    let tree: any = await fs.readDir(directory, {recursive: true});
    if (!tree) {
        console.error("Cannot load directory");
        return;
    }
    let directoryName = directory.split(path.sep).pop();
    tree = [{id: -1, name: directoryName, path: directory, children: buildTree(sortTree(tree))}];
    filetree.set(tree);
    id = 0;
    return directoryName;
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
    const filename = file.split(path.sep).pop();
    if (!await dialog.confirm(`Are you sure you want to move "${filename}" from "./${source.split(path.sep).pop()}" into "./${dest.split(path.sep).pop()}?"`, {title: "Nucleus: Move File"})) {
        return;
    }

    try {
        await fs.renameFile(file, `${dest}${path.sep}${filename}`);
    } catch (error) {
        console.error(error);
    }
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

export async function openInExplorer(path: string) {
    invoke("open_in_explorer",{ path: path});
}

export async function moveToTrash(p: string) {
    // open dialog to choose between recycling bin and perm delete
    if (!await dialog.ask(`Are you sure you want to delete ${p.split(path.sep).pop()}?`)) return;
    await invoke("delete_file", {path: p, perm: false})
}

export async function createFolder(p) {
    try {
        await fs.createDir(p);
    } catch (error) {
        console.log(error);
    }
}
export async function createFile(p) {
    try {
        await fs.writeFile(p, "");
    } catch (error) {
        console.log(error);
    }
    addEditorTab(p, p.split(path.sep).pop());
}

export async function renameFile(filename: string, oldpath: string) {
    if (filename.length === 0) {
        console.warn("filename length 0")
        return false;
    }
    if (await invoke("is_file", {path: oldpath}) && filename.includes(path.sep)) {
        console.warn("invalid filename")
        return false;
    }
    let newpath = oldpath.replace(oldpath.split(path.sep).pop(), filename);

    try {
        await fs.renameFile(oldpath, newpath);
    } catch (error) {
        console.error(error);
        return false;   
    }
    let tab = get(tabs).find(t => t.active && t.isfile);
    renameTab(tab, filename, newpath);
    return true;
}
