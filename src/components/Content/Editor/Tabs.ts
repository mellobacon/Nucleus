import { writable } from 'svelte/store';
export let tabs = writable([]);
class Tab {
    label: string;
    id: number;
    active: boolean
    constructor(id: number, tabname:string = "", active:boolean = false) {
        this.id = id;
        this.label = tabname;
        this.active = active;
    }
}

let id = 0;
let activeid;
let tablist: Tab[] = [];
export function addTab() {
    let tab = new Tab(id);
    tablist = [...tablist, tab];
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
}

export function closeTab(id) {
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
}