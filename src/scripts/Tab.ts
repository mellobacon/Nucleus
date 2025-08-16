import { get, writable, type Writable } from "svelte/store";

export class Tab {
    id = 0;
    activeid = this.id;
    activeTab: Tab = null;
    active = false;
    saved = true;
    hidden = writable(true);
    isfile = writable(false);
    label = "";
    path = "";
    tabs: Writable<Tab[]> = writable([]);
    content = null;

    setActive(id: number) {
        this.tabs.update((tabs) => {
            for (let tab of tabs) {
                if (tab.id === id) {
                    this.activeid = id;
                    tab.active = true;
                    if (get(tab.isfile)) {
                        this.isfile.set(true);
                        tab.content.focusEditor();
                    }
                    else {
                        this.isfile.set(false);
                    }
                    this.activeTab = tab;
                }
                else {
                    tab.active = false;
                }
            }
            return tabs;
        })
        this.updateView();
    }
    updateTabs(tab: Tab = null) {
        if (tab) {
            this.tabs.set([...get(this.tabs), tab])
        }
        if (get(this.tabs).length > 0) {
            this.hidden.set(false);
        }

        this.setActive(this.id);
        this.id++;
    }
    tabOpen(path: string) {
        for (const tab of get(this.tabs)) {
            if (tab.path === path) {
                this.setActive(tab.id);
                return true;
            }
        }
        return false;
    }
    addTab(path: string = "", label: string = "", content = null, options: {multiple?: boolean, saveState?: boolean, isFile?: boolean} = {multiple: false, saveState: true, isFile: false}) {
        // dont add tabs that are already open
        if (this.tabOpen(path) && !options.multiple) {
            return;
        }
        let tab: Tab = new Tab();
        tab.id = this.id;
        tab.label = label === "" ? `Untitled-${this.id}` : label;
        tab.path = path === "" ? tab.label : path;
        tab.content = content;
        tab.saved = options.saveState;
        tab.isfile.set( options.isFile);

        this.updateTabs(tab);
    }
    async closeTab(tabid: number) {
        if (this.activeid === tabid) {
            for (let i = 0; i <= get(this.tabs).length - 1; i++) {
                // set right tab active
                if (get(this.tabs)[i].id === tabid && get(this.tabs)[i + 1]) {
                    this.setActive(get(this.tabs)[i + 1].id);
                    break;
                }
                // set left tab active
                else if (get(this.tabs)[i].id === tabid && get(this.tabs)[i - 1]) {
                    this.setActive(get(this.tabs)[i - 1].id);
                    break;
                }
            }
        }
        
        get(this.tabs).find(t => t.id === tabid).content.$destroy();
        const tablist = get(this.tabs).filter(t => t.id !== tabid);
        this.tabs.set(tablist);
        
        if (get(this.tabs).length === 0) {
            this.hidden.set(true);
            this.isfile.set(false);
            this.id = 0;
        }
    }
    async closeAllTabs() {
        await this.closeTab(this.activeid);
        const temp = [...get(this.tabs)].reverse();
        for (const tab of temp) {
            await this.closeTab(tab.id);
        }
    }
    updateView() {
        for (let tab of get(this.tabs)) {
            if (tab.active) {
                tab.content.$set({hidden: false})
            }
            else {
                tab.content.$set({hidden: true})
            }
        }
    }
    refreshTabList(tablist = []) {
        if (tablist.length === 0) {
            tablist = get(this.tabs);
        }
        this.tabs.set(tablist);
    }
}