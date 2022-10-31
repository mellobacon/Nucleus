import { readTextFile, writeFile } from "@tauri-apps/api/fs";
import { sep } from "@tauri-apps/api/path";
import { dialog } from "@tauri-apps/api";
import { setActive, tablist } from "../components/Content/Editor/scripts/Tab";
import type { FileTab } from "../components/Content/Editor/scripts/Tab";

export class EditorFile {
    filename: string;
    path: string;
    content: string;
    linefeed: string;
    constructor(filename: string, path: string, linefeed: string, content: string) {
        this.filename = filename;
        this.path = path;
        this.linefeed = linefeed;
        this.content = content;
    }
}

export async function openFile() {
    let path = await dialog.open() as string;
    if (path === undefined) return;
    return path;
}
export async function getFileData(path = "", label = "") {
    if (path === null) return;
    if (path === "") {
        return new EditorFile(label, path, getLF(""), "");
    }
    let filename = path.split(sep).pop();
    let content = await readTextFile(path);
    let linefeed = getLF(content);
    return new EditorFile(filename, path, linefeed, content);
}

export async function saveFile() {
    for (let tab of tablist) {
        if (tab.active) {
            let t = tab as FileTab;
            if (t.path === "") {
                const filePath = await dialog.save({
                    defaultPath: `${tab.label}.txt`
                }) as string;
                if (filePath == undefined) return;

                let file = new EditorFile(filePath.split(sep).pop(), filePath, getLF(""), "");
                t.setFile(file);
                t.saved = true;
                setActive(tab.id);
            }
            else {
                writeFile(t.path, t.editorcontent);
            }
        }
    }
}

export function renameFile(label, path) {
    let tab = tablist.find(t => t.active);
    tab.label = label;
    (tab as FileTab).path = path;
    setActive(tab.id);
}

export function setFileLanguage(lang) {
    let tab = tablist.find(t => t.active) as FileTab;
    tab.setLanguage(lang);
}
function getLF(content: string) {
    return content.includes('\r\n') ? 'CRLF' : 'LF'
}