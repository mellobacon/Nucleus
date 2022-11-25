import { writable } from 'svelte/store';
import { EditorFile, getFileData } from '../../../scripts/EditorFile'
import CodeMirrorEditor from '../../Editor/CodeMirrorEditor.svelte';
import { writeFile } from '@tauri-apps/api/fs';
import { getLang, getLangMode } from '../../Editor/scripts/Editor';

let id = 0;
let activeid;

export let file_language = writable("");
export let linefeed = writable("");
export let tablist: Tab[] = [];
export let tabs = writable([]);
export let hidden = writable(true);
export let isfile = writable(false);

class Tab {
    id: number;
    label: string;
    active: boolean;
    constructor(id: number, label: string = "") {
        this.id = id;
        this.label = label === "" ? `Untitled-${id}` : label;
    }
}

export class FileTab extends Tab {
    path: string;
    language: string = "Plain Text";
    linefeed: string;
    saved: boolean = true;
    editor: CodeMirrorEditor | null;
    editorcontent: string;
    constructor(id: number, file: EditorFile, editor, saved: boolean = true) {
        super(id, file.filename);
        this.path = file.path;
        this.saved = saved;
        this.editor = editor;
        this.editorcontent = file.content;

        let filepath = file.path.split(".");
        let extension = "txt";
        if (filepath.length !== 1) {
            extension = filepath.at(-1);
        }

        this.language = getLang(extension)
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
                        setActive(this.id);
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

        file_language.set(lang);
        this.language = lang;
    }
    setFile(file: EditorFile) {
        this.label = file.filename === "" ? `Untitled-${this.id}` : file.filename;
        this.path = file.path;
        let filepath = file.path.split(".");
        let extension = "txt";
        if (filepath.length !== 1) {
            extension = filepath.at(-1);
        }
        this.language = getLang(extension);

        this.linefeed = file.linefeed;
    }
    focusTab() {
        file_language.set(this.language);
        linefeed.set(this.linefeed);
        this.editor.focus();
    }
    updateEditorVisibility(id: number) {
        this.editor.$set({ hidden: !(this.id === id) })
    }
}
export class SettingsTab extends Tab {
    content: string;
    constructor(id: number, label: string, content: string) {
        super(id, label);
        this.content = content;
    }
}

export async function addFileTab(path = "") {
    for (let t of tablist) {
        if ((t as FileTab).path === path) {
            setActive(t.id);
        }
    }
    let file = await getFileData(path);
    let editor = new CodeMirrorEditor({ target: document.getElementById("tabview"), props: { content: file.content } });
    let tab = new FileTab(id, file, editor, path !== "");
    await tab.setLanguage(tab.language);
    tablist = [...tablist, tab];

    refreshTabs();
}

export function addSettingsTab() {
    let content = "";
    let tab = new SettingsTab(id, "Settings", content);
    tablist = [...tablist, tab];

    refreshTabs();
}

export function setActive(id: number) {
    for (let tab of tablist) {
        if (tab.id === id) {
            activeid = id;
            tab.active = true;
            if (tab instanceof FileTab) {
                let t = tab as FileTab;
                isfile.set(true);
                t.focusTab();
            }
            else {
                isfile.set(false);
            }
        }
        else {
            tab.active = false;
        }
    }
    tabs.set(tablist);
    updateEditorVisibility();
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
    
    for (let tab of tablist) {
        if (tab.id === tabid) {
            (tab as FileTab).editor.$destroy();
            break;
        }
    }
    tablist = tablist.filter(t => t.id !== tabid);
    tabs.set(tablist);
    
    updateEditorVisibility();
    if (tablist.length === 0) {
        hidden.set(true);
        isfile.set(false);
        id = 0;
    }
}

function refreshTabs() {
    if (tablist.length > 0) {
        hidden.set(false);
        isfile.set(true);
    }
    tabs.set(tablist);
    setActive(id);
    id++;
}

function updateEditorVisibility() {
    for (let tab of tablist) {
        (tab as FileTab).updateEditorVisibility(activeid);
    }
}
