import { dialog, fs } from "@tauri-apps/api";
import { sep } from "@tauri-apps/api/path";
import { writable } from "svelte/store";
import { filetree } from "./TreeStore";
let parentname: string;
let dir;
export let loadingtree = writable(false);
export async function data() {
    let dirname = await dialog.open({ directory: true }) as string;
    if (dirname === null) return;
    dir = dirname;
    loadingtree.set(true);
    return await loadTree();
}

async function loadTree() {
    let children = await fs.readDir(dir, { recursive: true });
    id = 0;
    cache = [];
    let nodes = buildTree(sort(children));
    parentname = dir.split(sep).pop();
    let tree = [{id: -1, name: dir.split(sep).pop(), children: nodes, path: dir}];
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
