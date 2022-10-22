import { writeFile, writeTextFile } from '@tauri-apps/api/fs';
import { writable } from 'svelte/store';
import { loadFile } from '../../FileTree/TreeData';
import CodeMirrorEditor from './CodeMirrorEditor.svelte';
export let tabs = writable([]);
export let hidden = writable(true);

class Tab {
    label: string;
    path: string;
    id: number;
    active: boolean;
    editor: CodeMirrorEditor | null;
    editorcontent: string;
    saved: boolean;
    constructor(id: number, tabname: string = "", path: string, editor = null, editorcontent = "", active: boolean = false, saved: boolean = true) {
        this.id = id;
        this.label = tabname === "" ? `Untitled-${id}` : tabname;
        this.path = path;
        this.active = active;
        this.editor = editor
        this.editorcontent = editorcontent
        this.saved = saved;

        let _ = undefined;
        this.editor.$on("input", (e) => {
            clearTimeout(_);
            _ = setTimeout(() => {
                if (this.path) {
                    writeFile(this.path, e.detail);
                    console.log(`${this.label} saved`);
                }
                else {
                    console.log('unnamed buffer ${this.label}, not saving');
                }
            }, 1000)
        })
    }    
}

let id = 0;
let activeid;
let tablist: Tab[] = [];
export async function addTab(f: string) {
    if (tablist.find(file => file.path === f)) {
        setActive(tablist.find(file => file.path === f).id);
        return;
    }
    let file = await loadFile(f);
    let editor = new CodeMirrorEditor({ target: document.getElementById("tabview"), props: { content: file.content } });
    let tab = new Tab(id, file.filename, file.path, editor, file.content);
    tablist = [...tablist, tab];
    if (tablist.length > 0) {
        hidden.set(false);
    }
    tabs.set(tablist);
    setActive(id);
    id++;
}

export async function addNewFileTab() {
    let content = "";
    let editor = new CodeMirrorEditor({ target: document.getElementById("tabview"), props: { content: content } });
    let tab = new Tab(id, null, null, editor, content);
    tablist = [...tablist, tab];
    if (tablist.length > 0) {
        hidden.set(false);
    }
    tabs.set(tablist);
    setActive(id);
    id++;
}

export async function saveFileAs(filePath: string) {
    console.log('saveFileAs ${filePath}');
    for (let tab of tablist) {
        if (tab.active) {
            console.log("found active tab");
            tab.path = filePath;
            tab.label = filePath;
        }
    }
}

export function setActive(id) {
    for (let tab of tablist) {
        if (tab.id === id) {
            activeid = id;
            tab.active = true;
        }
        else {
            tab.active = false;
        }
    }
    tabs.set(tablist);
    updateEditorVisibility();
}

function updateEditorVisibility() {
    for (let tab of tablist) {
        tab.editor.$set({ hidden: !(tab.id === activeid) })
    }
}

export function closeTab(tabid: number) {
    if (activeid === tabid) {
        for (let i = 0; i <= tablist.length - 1; i++) {
            if (tablist[i].id === tabid && tablist[i + 1]) {
                setActive(tablist[i + 1].id);
                break;
            }
            else if (tablist[i].id === tabid && tablist[i - 1]) {
                setActive(tablist[i - 1].id);
                break;
            }
        }
    }

    tablist.find(t => t.id === tabid).editor.$destroy();
    tablist = tablist.filter(t => t.id !== tabid);
    tabs.set(tablist);
    
    updateEditorVisibility();
    if (tablist.length === 0) {
        hidden.set(true);
        id = 0;
    }
}