import { dialog, fs, path } from "@tauri-apps/api";
import { get } from 'svelte/store';
import { tabs } from "./EditorTabList.svelte";

export async function saveFile(saveAs = false) {
    const tab = get(tabs).find(t => t.active && t.isfile);
    if (!tab.path.includes(path.sep) || tab.path === "" || saveAs) {
        let newPath = await dialog.save({defaultPath: `${tab.label}.txt`});
        if (newPath === null) return;

        tab.path = newPath;
        tab.label = newPath.split(path.sep).pop();
    }
    // write changes to the file
    fs.writeFile(tab.path, tab.content.getFileContent());
    tab.content.updateFileInfo({
        "filename": tab.label,
        "path": tab.path,
        "fileType": await path.extname(tab.path),
        "readonly": false,
    });
    tab.setActive(tab.id);
}

export function updateSaveState(saved = true) {
    if (saved) return; // prevents this being fired on every state check
    const tab = get(tabs).find(t => t.active && t.isfile);
    tab.saved = false;
    tab.setActive(tab.id);
}