import { writable } from "svelte/store";
import Editor from "../Editor.svelte";
import { path as p } from "@tauri-apps/api";

export class Tab {
    id = 0;
    activeid = this.id;
    tablist = [];
    Tab; // Tab class
    hidden = writable(true);
    isfile = writable(false);
    tabs = writable([]);
    constructor (Tab) {
        this.Tab = Tab;
    }

    setActive(id: number) {
        for (let tab of this.tablist) {
            if (tab.id === id) {
                this.activeid = id;
                tab.active = true;
                if (tab.isfile) {
                    this.isfile.set(true);
                    tab.content.focus();
                }
                else {
                    this.isfile.set(false);
                }
            }
            else {
                tab.active = false;
            }
        }
        this.tabs.set(this.tablist);
        this.updateView();
    }
    updateTabs() {
        if (this.tablist.length > 0) {
            this.hidden.set(false);
        }

        this.tabs.set(this.tablist);
        this.setActive(this.id);
        this.id++;
    }
    tabOpen(path: string) {
        for (const tab of this.tablist) {
            if (tab.path === path) {
                this.setActive(tab.id);
                return true;
            }
        }
        return false;
    }
    addTab(path: string = "", label: string = "") {
        // dont add tabs that are already open
        if (this.tabOpen(path)) {
            return;
        }
        
        let tab = new this.Tab(this.id, label, null, path);
        this.tablist = [...this.tablist, tab];

        this.updateTabs();
    }
    async addEditorTab(path: string, label: string = "") {
        if (this.tabOpen(path)) {
            return;
        }
        let content = new Editor({target: document.getElementById("tabview"), props: {content: ""}});
        let tab = new this.Tab(this.id, label, content, path);
        tab.isfile = true;
        tab.saved = true;
        let fileType = "";
        try {
            fileType = await p.extname(tab.path);
        } catch (error) {
            console.warn("Cannot find file extension. Setting to empty string.")
            fileType = "";
        }
        content.updateFileInfo({
            "filename": tab.label,
            "path": tab.path,
            "fileType": fileType,
            "readonly": false,
        });
        this.tablist = [...this.tablist, tab];

        this.updateView();

        this.updateTabs();
    }
    closeTab(tabid: number) {
        if (this.activeid === tabid) {
            for (let i = 0; i <= this.tablist.length - 1; i++) {
                // set right tab active
                if (this.tablist[i].id === tabid && this.tablist[i + 1]) {
                    this.setActive(this.tablist[i + 1].id);
                    break;
                }
                // set left tab active
                else if (this.tablist[i].id === tabid && this.tablist[i - 1]) {
                    this.setActive(this.tablist[i - 1].id);
                    break;
                }
            }
        }
    
        this.tablist.find(t => t.id === tabid).content.$destroy();
        this.tablist = this.tablist.filter(t => t.id !== tabid);
        this.tabs.set(this.tablist);
        
        if (this.tablist.length === 0) {
            this.hidden.set(true);
            this.isfile.set(false);
            this.id = 0;
        }
    }
    closeAllTabs() {
        for (const tab of this.tablist) {
            this.closeTab(tab.id);
        }
    }
    updateView() {
        for (let tab of this.tablist) {
            tab.updateView(this.activeid);
        }
    }
}
