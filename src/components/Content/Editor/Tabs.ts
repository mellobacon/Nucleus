import { writable } from 'svelte/store';
import { loadFile } from '../../FileTree/TreeData';
import CodeMirrorEditor from './CodeMirrorEditor.svelte';
export let tabs = writable([]);
export let hidden = writable(true);
class Tab {
    label: string;
    id: number;
    active: boolean
    editor
    constructor(id: number, tabname: string = "", editor = null, active: boolean = false) {
        this.id = id;
        this.label = tabname === "" ? `Untitled-${id}` : tabname;
        this.active = active;
        this.editor = editor
    }
}

let id = 0;
let activeid;
let tablist: Tab[] = [];
export async function addTab() {
    let file = await loadFile();
    let tab = new Tab(id, file.filename, new CodeMirrorEditor({ target: document.getElementById("tabview") }));
    tablist = [...tablist, tab];
    if (tablist.length > 0) {
        hidden.set(false);
    }
    tabs.set(tablist);
    setActive(id);
    id++;
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

export function closeTab(id) {
    tablist[id].editor.$destroy();
    tablist = tablist.filter(t => t.id !== id);
    tabs.set(tablist);
    for (let _ of tablist) {
        if (activeid >= tablist.length - 1) {
            setActive(id - 1);
        }
        else {
            setActive(id + 1);
        }
    }
    if (tablist.length === 0) {
        hidden.set(true);
        return;
    }
    updateEditorVisibility();
}