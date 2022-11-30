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

export async function execute(shortcut) {
    switch (shortcut) {
        case "new-file-shortcut":
            await addFileTab();
            break;
        case "open-file-shortcut":
            openFile();
            break;
        case "open-folder-shortcut":
            openFolder();
            break;
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