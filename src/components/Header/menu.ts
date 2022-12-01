import { appWindow } from "@tauri-apps/api/window";
import { addNewFile, openFile, openFolder, openSettings, saveOpenFile } from "./header_menus/FileMenu";
import settings from "../../config/nucleus-settings.json";
import { getShortcut } from "../../config/config";
import { shell } from "@tauri-apps/api";
const shortcuts = settings.shortcuts;

export const filemenu = [
    { option: "New File...", shortcut: getShortcut(shortcuts["new-file-shortcut"]), onclick: addNewFile },
    { option: "Open File...", shortcut: getShortcut(shortcuts["open-file-shortcut"]), onclick: openFile },
    { option: "Open Folder", shortcut: getShortcut(shortcuts["open-folder-shortcut"]), onclick: openFolder },
    { option: "Open Recent", onclick: () => { console.log("click"); } },
    { option: "Save File", shortcut: getShortcut(shortcuts["save-file-shortcut"]), onclick: saveOpenFile, divider: true },
    { option: "Save File As...", shortcut: getShortcut(shortcuts["save-file-as-shortcut"]), onclick: saveOpenFile },
    { option: "Settings", onclick: openSettings, divider: true },
    { option: "Exit", onclick: async () => { await appWindow.close(); } }
];
export const editmenu = [
    { option: "Undo", shortcut: getShortcut(shortcuts["undo-shortcut"]), onclick: () => { console.log("click"); } },
    { option: "Redo", shortcut: getShortcut(shortcuts["redo-shortcut"]), onclick: () => { console.log("click"); } },
    { option: "Delete", shortcut: getShortcut(shortcuts["delete-shortcut"]), onclick: () => { console.log("click"); } },
    { option: "Cut", shortcut: getShortcut(shortcuts["cut-shortcut"]), onclick: () => { console.log("click"); }, divider: true },
    { option: "Copy", shortcut: getShortcut(shortcuts["copy-shortcut"]), onclick: () => { console.log("click"); } },
    { option: "Paste", shortcut: getShortcut(shortcuts["paste-shortcut"]), onclick: () => { console.log("click"); } },
    { option: "Find", shortcut: getShortcut(shortcuts["find-shortcut"]), onclick: () => { console.log("click"); }, divider: true },
    { option: "Select All", shortcut: getShortcut(shortcuts["select-all-text-shortcut"]), onclick: () => { console.log("click"); } }
];
export const viewmenu = [
    { option: "Layout", onclick: () => { console.log("click"); } },
    { option: "Appearance", onclick: () => { console.log("click"); } },
    { option: "Plugins", onclick: () => { console.log("click"); } },
    { option: "Toggle Theme", shortcut: "Ctrl + Alt + T", onclick: () => { console.log("click"); }, divider: true },
    { option: "Toggle Windows", onclick: () => { console.log("click"); } }
];
export const runmenu = [
    { option: "Build", shortcut: getShortcut(shortcuts["build-shortcut"]), onclick: () => { console.log("click"); } },
    { option: "Run", shortcut: getShortcut(shortcuts["run-shortcut"]), onclick: () => { console.log("click"); } },
    { option: "Run without debugging", shortcut: getShortcut(shortcuts["run-no-debug-shortcut"]), onclick: () => { console.log("click"); } },
    { option: "Add configuration", onclick: () => { console.log("click"); }, divider: true },
    { option: "Edit configuration", onclick: () => { console.log("click"); } },
    { option: "Install debugger...", onclick: () => { console.log("click"); } },
];
export const helpmenu = [
    { option: "Documentation", onclick: () => { console.log("click"); } },
    { option: "View Commands", onclick: () => { console.log("click"); } },
    { option: "Toggle developer tools", onclick: () => { console.log("click"); } },
    { option: "Release Notes", onclick: () => { console.log("click"); }, divider: true },
    { option: "Check for Updates", onclick: async() => { console.log("click"); } },
    { option: "About Editor", onclick: async() => { shell.open("https://github.com/mellobacon/Nucleus") } },
];