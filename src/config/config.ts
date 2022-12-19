import { writable } from "svelte/store";
import { openFile, openFolder, saveOpenFile, saveOpenFileAs } from "../components/Header/header_menus/FileMenu";
import { addFileTab, tablist } from "../components/Tabs/scripts/Tab";

export const systemfonts = writable([]);
export const editorfont = writable("");
export const windowtheme = writable("");
export let font = "";
export const autosave = writable(false);

export function getShortcut({ primaryKey, secondaryKey, modifier }) {
    if (modifier) {
        modifier = `${modifier} + `;
    }
    if (secondaryKey) {
        secondaryKey = `${secondaryKey} + `;
    }
    return `${modifier}${secondaryKey}${primaryKey}`;
}

export function executeEditorShortcut(shortcut) {
    switch (shortcut) {
        case "save-file-shortcut":
            saveOpenFile();
            break;
        case "save-file-as-shortcut":
            saveOpenFileAs();
            break;
        case "find-shortcut":
            console.log(shortcut);
            break;
        case "select-all-text-shortcut":
            break;
    }
}
export async function executeWindowShortcut(shortcut) {
    switch (shortcut) {
        case "new-file-shortcut":
            await addFileTab();
            break;
        case "open-file-shortcut":
            await openFile();
            break;
        case "open-folder-shortcut":
            await openFolder();
            break;
        case "build-shortcut":
            console.log(shortcut);
            break;
        case "run-shortcut":
            console.log(shortcut);
            break;
        case "run-no-debug-shortcut":
            console.log(shortcut);
            break;
    }
}

export function getTime() {
    let time = new Intl.DateTimeFormat('en-US', {dateStyle: "short", timeStyle: "long"}).format();
    return time;
}

export function getInstalledFonts(fonts: []) {
    let fontlist = [];
    let id = 0;
    for (const f of fonts) {
        let font = {id: id, name: f};
        fontlist = [...fontlist, font];
        id++;
    }
    systemfonts.set(fontlist);
}
export function setFont(efont) {
    editorfont.set(efont);
    editorfont.subscribe(f => (font = f));
    for (const tab of tablist) {
        if (tab.active && tab.isfile) {
            tab.refreshView(tab);
        }
    }
    
}