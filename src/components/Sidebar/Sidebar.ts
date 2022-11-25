import { writable } from "svelte/store";

class Tool {
    tabname: string;
    content;
    constructor(tabname: string, content) {
        this.tabname = tabname;
        this.content = content;
    }
}

export let activeid = writable(-1);
let active = -1;
export let showsidebarview = writable(false);
export let tool = writable(null);

export const toggleActive = (tab: { id: any; tabname: any; icon: any, content: any }) => {
    if (active === tab.id) {
        active = -1;
        activeid.set(-1);
        showsidebarview.set(false);
    }
    else {
        activeid.set(tab.id);
        active = tab.id;
        showsidebarview.set(true);
        tool.set(new Tool(tab.tabname, tab.content));
    }
}
