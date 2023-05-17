import { writable } from "svelte/store";

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
            console.log(shortcut);
            break;
        case "save-file-as-shortcut":
            console.log(shortcut);
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
            console.log(shortcut);
            break;
        case "open-file-shortcut":
            console.log(shortcut);
            break;
        case "open-folder-shortcut":
            console.log(shortcut);
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
    
}