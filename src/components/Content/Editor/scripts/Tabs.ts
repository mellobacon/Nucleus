import { dialog } from '@tauri-apps/api';
import { writeFile, writeTextFile } from '@tauri-apps/api/fs';
import { sep, videoDir } from '@tauri-apps/api/path';
import { writable } from 'svelte/store';
import { createFile, loadFile } from '../../../FileTree/scripts/TreeData';
import CodeMirrorEditor from '../CodeMirrorEditor.svelte';
import { getLang, getLangMode } from './Editor';
export let tabs = writable([]);
export let file_language = writable("");
export let linefeed = writable("");
export let hidden = writable(true);

class Tab {
    label: string;
    path: string;
    language: string = "Plain Text";
    linefeed: string;
    id: number;
    active: boolean = false;
    editor: CodeMirrorEditor | null;
    editorcontent: string;
    saved: boolean = true;
    constructor(id: number, file , editor = null, saved: boolean = true) {
        this.id = id;
        this.label = file.filename === "" ? `Untitled-${id}` : file.filename;
        this.path = file.path;
        this.editor = editor;
        this.editorcontent = file.content;
        this.saved = saved;

        let filepath = file.path.split(".");
        let extension = "txt";
        if (filepath.length !== 1) {
            extension = filepath.at(-1);
        }
        this.language = getLang(extension);

        this.linefeed = file.linefeed;
        
        let _ = undefined;
        this.editor.$on("input", (e) => {
            clearTimeout(_);
            _ = setTimeout(() => {
                this.editorcontent = e.detail;
                if (this.path !== "") {
                    writeFile(this.path, e.detail);
                    console.log(`${this.label} saved`);
                    if (!this.saved) {
                        this.saved = true;
                        setActive(id);
                    }
                }
                else {
                    this.saved = false;
                }
            }, 1000)
        })
    }   
    
    async setLanguage(lang: string) {
        let mode = await getLangMode(lang);
        this.editor.setLanguageMode(mode);
    }
    setFile(file) {
        this.label = file.filename === "" ? `Untitled-${id}` : file.filename;
        this.path = file.path;
        let filepath = file.path.split(".");
        let extension = "txt";
        if (filepath.length !== 1) {
            extension = filepath.at(-1);
        }
        this.language = getLang(extension);

        this.linefeed = file.linefeed;
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
    let tab = new Tab(id, file, editor);
    await tab.setLanguage(tab.language);
    
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
    let file = createFile(); // create empty file
    let tab = new Tab(id, file, editor, false);
    tablist = [...tablist, tab];
    if (tablist.length > 0) {
        hidden.set(false);
    }
    tabs.set(tablist);
    setActive(id);
    id++;
}

export async function saveFile() {
    for (let tab of tablist) {
        if (tab.active) {
            if (tab.path === "") {
                const filePath = await dialog.save({
                    defaultPath: `${tab.label}.txt`
                  }) as string;
                if (filePath == undefined) return;
                let file = createFile(filePath.split(sep).pop(), filePath);
                tab.setFile(file);
                tab.saved = true;
                setActive(tab.id); // refresh active tab to load file data in status bar
            }
            else {
                writeFile(tab.path, tab.editorcontent);
            }
            break;
        }
    }
}

export function renameFile(label, path) {
    let tab = tablist.find(t => t.active);
    tab.label = label;
    tab.path = path;
    setActive(tab.id);
}

export function setLanguage(language) {
    for (let tab of tablist) {
        if (tab.active) {
            file_language.set(language);
            tab.language = language;
            tab.setLanguage(language);
            break;
        }
    }
}

export function isSaved(id) {
    return tablist.find(t => t.id == id).saved;
}

export function setActive(id) {
    for (let tab of tablist) {
        if (tab.id === id) {
            activeid = id;
            tab.active = true;
            file_language.set(tab.language);
            linefeed.set(tab.linefeed);
            tab.editor.focus();
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