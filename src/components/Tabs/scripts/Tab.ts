import CodeMirrorEditor from '../../Editor/CodeMirrorEditor.svelte';
import Settings from '../../Settings/Settings.svelte';
import { writable } from 'svelte/store';
import { getFileData } from '../../../scripts/EditorFile';
import { addNotification, NotifType } from "../../Notifications/Notifications";
import { showpanel } from '../../../components/Footer/Footer.svelte';

let id = 0;
let activeid;

export let tablist: Tab[] = [];
export let tabs = writable([]);
export let hidden = writable(true);
export let isfile = writable(false);

class Tab {
    id: number;
    label: string;
    active: boolean;
    path: string;
    content;
    isfile: boolean;
    saved = true;
    constructor(id, label = "", content = null, path = "") {
        this.id = id;
        this.label = label === "" ? `Untitled-${id}` : label;
        this.path = path === "" ? this.label : path;
        this.content = content;
    }
    updateView(id) {
        this.content.$set({ hidden: !(this.id === id) });
    }
    refreshView(tab) {
        if (tab.isfile) {
            tab.content.updateTheme();
        }
    }
}

export async function addFileTab(path = "") {
    if (tabOpen(path)) {
        return;
    }
    let file = await getFileData(path);
    if (!file.support) {
        addNotification(NotifType.Error, "File cannot open; File is currently unsupported");
        showpanel.set(true);
        return;
    }
    let content = new CodeMirrorEditor({ target: document.getElementById("tabview"), props: { content: file.content } });
    let tab = new Tab(id, file.filename, content, file.path);
    tab.isfile = true;
    content.setFileInfo(file);
    tablist = [...tablist, tab];
    refreshTabs();
}

export function addSettingsTab() {
    let content = new Settings({target: document.getElementById("tabview")});
    let tab = new Tab(id, "Settings", content);
    tablist = [...tablist, tab];
    refreshTabs();
}

export function setActive(id: number) {
    for (let tab of tablist) {
        if (tab.id === id) {
            activeid = id;
            tab.active = true;
            if (tab.isfile) {
                isfile.set(true);
                tab.content.focus();
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
    updateView();
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

    tablist.find(t => t.id === tabid).content.$destroy();
    tablist = tablist.filter(t => t.id !== tabid);
    tabs.set(tablist);

    updateView();
    
    if (tablist.length === 0) {
        hidden.set(true);
        isfile.set(false);
        id = 0;
    }
}
export function closeAllTabs() {
    for (const tab of tablist) {
        closeTab(tab.id);
    }
}

function refreshTabs() {
    if (tablist.length > 0) {
        hidden.set(false);
    }
    tabs.set(tablist);
    setActive(id);
    id++;
}

function updateView() {
    for (let tab of tablist) {
        tab.updateView(activeid);
    }
}
function tabOpen(path) {
    for (const tab of tablist) {
        if (tab.path === path) {
            setActive(tab.id);
            return true;
        }
    }
    return false;
}