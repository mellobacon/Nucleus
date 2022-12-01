import { openFile, openFolder, saveOpenFile, saveOpenFileAs } from "../components/Header/header_menus/FileMenu";
import { addFileTab } from "../components/Tabs/scripts/Tab";

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