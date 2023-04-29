import { writable } from "svelte/store";

export let hidden = writable(true);
export let tablist: Tab[] = [];
export let tabs = writable([]);

let id = 0;
let activeid = id;
class Tab {
    id: number;
    label: string;
    active: boolean;
    path: string;
    content;
    isfile: boolean;
    saved = true;
    constructor(id: number, label = "", content = null, path = "") {
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

export function addTab(path: string = "", label: string = "") {
    // dont add tabs that are already open
    if (tabOpen(path)) {
        return;
    }
    
    let tab = new Tab(id, label, null, path);
    tablist = [...tablist, tab];

    refreshTabs();
}

export function setActive(id: number) {
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
}

function refreshTabs() {
    if (tablist.length > 0) {
        hidden.set(false);
    }
    tabs.set(tablist);
    setActive(id);
    id++;
}
function tabOpen(path: string) {
    for (const tab of tablist) {
        if (tab.path === path) {
            setActive(tab.id);
            return true;
        }
    }
    return false;
}