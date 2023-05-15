import { writable } from "svelte/store";

export class Tab {
    id = 0;
    activeid = this.id;
    tablist = [];
    Tab; // Tab class
    hidden = writable(true);
    tabs = writable([]);
    constructor (Tab) {
        this.Tab = Tab;
    }

    setActive(id: number) {
        for (let tab of this.tablist) {
            if (tab.id === id) {
                this.activeid = id;
                tab.active = true;
            }
            else {
                tab.active = false;
            }
        }
        this.tabs.set(this.tablist);
    }
    updateTabs() {
        if (this.tablist.length === 0) {
            this.hidden.set(true);
            this.id = 0;
            return;
        }

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
    
        //tablist.find(t => t.id === tabid).content.$destroy();
        this.tablist = this.tablist.filter(t => t.id !== tabid);
        this.tabs.set(this.tablist);
        
        if (this.tablist.length === 0) {
            this.hidden.set(true);
            this.id = 0;
        }
    }
    CloseAllTabs() {
        for (const tab of this.tablist) {
            this.closeTab(tab.id);
        }
    }
}
