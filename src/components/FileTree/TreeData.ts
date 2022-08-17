import { dialog, fs } from "@tauri-apps/api";
import { readTextFile } from "@tauri-apps/api/fs";
import { sep } from "@tauri-apps/api/path";
import { filetree } from "../FileTree/TreeStore";
let parentname: string;
let dir;
export async function data() {
    let dirname = await dialog.open({ directory: true }) as string;
    if (dirname === null) return;
    dir = dirname;
    return await loadTree();
}

class File {
    filename: string;
    path: string;
    content: string;
    constructor(filename: string, path: string, content) {
        this.filename = filename;
        this.path = path;
        this.content = content;
    }
}
export async function loadFile() {
    let file = await dialog.open() as string;
    if (file === null) return;
    let filename = file.split(sep).pop();
    let content = await readTextFile(file);
    return new File(filename, file, content);
}

async function loadTree() {
    let children = await fs.readDir(dir, { recursive: true });
    id = 0;
    cache = [];
    let nodes = buildTree(sort(children));
    parentname = dir.split("\\").pop();
    let tree = [{id: -1, name: dir.split("\\").pop(), children: nodes, path: dir}];
    return tree;
}

export async function updateTree() {
    let tree = await loadTree();
    filetree.set(tree);
}

function sort(children) {
    let files = [];
    let folders = [];
    for (const child of children) {
        if (child.children) {
            folders.push(child)
            sort(child.children);
        }
        else {
            files.push(child);
        }
    }
    files.sort();
    folders.sort();
    folders.push(...files);
    return folders;
}

export function workspace() {
    return parentname;
}

// rebuild the tree so that it matches the TreeViewNode object from carbon components
let id = 0;
let cache = [];
function buildTree(children: fs.FileEntry[]) {
    let nodes = [];
    for (const child of children) {
        let node: {id: number, name: string; children?: any[]; path: string; } = {id: 0, name: "", children: null, path: ""};
        if (child.children) {
            node.children = buildTree(sort(child.children));
        }
        node.id = id;
        id++;
        node.name = child.name;
        node.path = child.path;
        cache.push(node);
        nodes.push(node);
    }
    return nodes;
}
