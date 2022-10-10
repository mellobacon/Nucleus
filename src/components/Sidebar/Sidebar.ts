import { writable } from "svelte/store";

let active = false;
let activeid = -1;
export let showtabview = writable(false);

class SidebarTab {
    tabname: string;
    content;
    constructor(tabname, content) {
        this.tabname = tabname;
        this.content = content;
    }
}
export let sidebartab = writable(new SidebarTab("", null));

export const toggleActive = (tab) => {
    active = !active;
    if (activeid === tab.id) {
        activeid = -1;
        document.getElementById(`sidetab-${tab.id}`).parentElement.classList.remove("bx--tabs__nav-item--selected");
        showtabview.set(false);
    }
    else {
        activeid = tab.id;
        document.getElementById(`sidetab-${tab.id}`).parentElement.classList.add("bx--tabs__nav-item--selected");
        sidebartab.set(new SidebarTab(tab.tabname, tab.content));
        showtabview.set(true);
    }
}