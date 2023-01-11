import { readTextFile } from "@tauri-apps/api/fs";
import { extname, sep } from "@tauri-apps/api/path";
import { dialog, fs, path } from "@tauri-apps/api";
import { setActive, tablist } from "../components/Tabs/scripts/Tab";
import { getLang } from "../components/Editor/scripts/Editor";
import { updateTree } from "../components/FileTree/scripts/TreeData";
import { invoke } from "@tauri-apps/api/tauri";

export class EditorFile {
    filename: string;
    path: string;
    content: string;
    linefeed: string;
    language;
    support: boolean;
    constructor(filename: string, path: string, linefeed: string, language, content: string, support = true) {
        this.filename = filename;
        this.path = path;
        this.linefeed = linefeed;
        this.content = content;
        this.language = language;
        this.support = support;
    }
}
export async function getFile() {
    let path = await dialog.open() as string;
    if (path === null || path === undefined) return;
    return path;
}
export async function getFileData(path = "", label = "") {
    if (path === null) return;
    let language = await getLang("");
    let filename = label;
    let content = "";
    let linefeed = "LF";
    let ext = "txt";
    let support = true;
    if (path !== "") {
        try {
            ext = await extname(path);
        } catch (error) {
            console.log("No file extension found. Setting to Plain Text...");
        }
        language = await getLang(ext);
        filename = path.split(sep).pop();
        try {
            content = await readTextFile(path);
        } catch (error) {
            console.log("Cannot read file content. Skipping...");
            support = false;
        }
        linefeed = content.includes("\r\n") ? "CLRF" : "LF";
    }
    return new EditorFile(filename, path, linefeed, language, content, support);
}
export async function saveFile() {
    for (let tab of tablist) {
        if (tab.active && tab.isfile) {
            let ispath = tab.path.includes(sep);
            if (!ispath) {
                const path = await dialog.save({defaultPath: `${tab.label}.txt`});
                if (path === null) return;
                await fs.writeFile(path, tab.content.getFileContent());
                const label = path.split(sep).pop();
                let file = await getFileData(path, label);
                tab.content.setFileInfo(file);
                tab.label = label;
                tab.path = path;
                tab.saved = true;
                setActive(tab.id);
                await updateTree();
            }
            else {
                tab.saved = true;
                await fs.writeFile(tab.path, tab.content.getFileContent());
                setActive(tab.id);
            }
            break;
        }
    }
}
export async function saveFileAs() {
    for (let tab of tablist) {
        if (tab.active && tab.isfile) {
            const path = await dialog.save({defaultPath: `${tab.label}.txt`});
            if (path === null) return;
            await fs.writeFile(path, tab.content.getFileContent());
            const label = path.split(sep).pop();
            let file = await getFileData(path, label);
            tab.content.setFileInfo(file);
            tab.label = label;
            tab.path = path;
            tab.saved = !tab.saved;
            setActive(tab.id);
            await updateTree();
            break;
        }
    }
}

export function updateSaveState() {
    for (const tab of tablist) {
        if (tab.active && tab.isfile) {
            tab.saved = false;
            setActive(tab.id);
            break;
        }
    }
}

export async function renameFile(label, path) {
    for (const tab of tablist) {
        if (tab.isfile) {
            tab.label = label;
            tab.path = path;
            const file = await getFileData(path, label);
            tab.content.setFileInfo(file);
            setActive(tab.id);
            break;
        }
    }
}

export function setFileLanguage(lang, mode = null) {
    for (const tab of tablist) {
        if (tab.active && tab.isfile) {
            tab.content.setLanguage(lang, mode);
            break;
        }
    }
}

export async function deleteFile(filepath, force = false) {
    if (force) {
        await fs.removeFile(filepath);
    }
    else {
        await invoke("delete_file", {path: filepath});
    }
}
export async function deleteDir(filepath, force = false) {
    if (force) {
        await fs.removeDir(filepath, {recursive: true});
    }
    else {
        await invoke("delete_file", {path: filepath});
    }
}