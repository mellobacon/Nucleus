import { dialog, fs } from "@tauri-apps/api";
let parentname: string;
export async function data() {
    let dirname = await dialog.open({ directory: true }) as string;
    let children = await fs.readDir(dirname, { recursive: true });
    id = 0;
    cache = [];
    let nodes = buildTree(children);
    parentname = dirname.split("\\").pop();
    let tree = [{id: -1, text: dirname.split("\\").pop(), children: nodes}];
    return tree;
}

export async function updateTree() {
    
}

export function getFileData(id) {
    console.log(cache[id]);
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
        let node: {id: number, text: string; children?: any[]; path: string; } = {id: 0, text: "", children: null, path: ""};
        node.id = id;
        id++;
        node.text = child.name;
        node.path = child.path;
        cache.push(node);
        if (child.children) {
            node.children = buildTree(child.children);
        }
        nodes.push(node);
    }
    return nodes;
}

/*
export async function printTree() {
    let dirname = await dialog.open({ directory: true }) as string;
    let children = await fs.readDir(dirname, { recursive: true });
    console.log(buildTree(children));
}
*/

