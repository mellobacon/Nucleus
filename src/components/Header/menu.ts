import { appWindow } from "@tauri-apps/api/window";
import { addNewFile, openFile, openFolder, openSettings, saveOpenFile } from "./header_menus/FileMenu";
export const filemenu = [
    { option: "New File...", shortcut: "Ctrl + N", onclick: addNewFile },
    { option: "Open File...", shortcut: "Ctrl + O", onclick: openFile },
    { option: "Open Folder", shortcut: "Ctrl + K", onclick: openFolder },
    { option: "Open Recent", onclick: () => { console.log("click"); } },
    { option: "Save File", shortcut: "Ctrl + S", onclick: saveOpenFile, divider: true },
    { option: "Save File As...", shortcut: "Ctrl + Shift + S", onclick: saveOpenFile },
    { option: "Settings", onclick: openSettings, divider: true },
    { option: "Exit", onclick: async () => { await appWindow.close(); } }
];
export const editmenu = [
    { option: "Undo", shortcut: "Ctrl + Z", onclick: () => { console.log("click"); } },
    { option: "Redo", shortcut: "Ctrl + Y", onclick: () => { console.log("click"); } },
    { option: "Delete", shortcut: "Delete", onclick: () => { console.log("click"); } },
    { option: "Cut", shortcut: "Ctrl + X", onclick: () => { console.log("click"); }, divider: true },
    { option: "Copy", shortcut: "Ctrl + C", onclick: () => { console.log("click"); } },
    { option: "Paste", shortcut: "Ctrl + V", onclick: () => { console.log("click"); } },
    { option: "Find", shortcut: "Ctrl + F", onclick: () => { console.log("click"); }, divider: true },
    { option: "Select All", shortcut:"Ctrl + A", onclick: () => { console.log("click"); } }
];
export const viewmenu = [
    { option: "Layout", onclick: () => { console.log("click"); } },
    { option: "Appearance", onclick: () => { console.log("click"); } },
    { option: "Plugins", onclick: () => { console.log("click"); } },
    { option: "Toggle Theme", shortcut: "Ctrl + Alt + T", onclick: () => { console.log("click"); }, divider: true },
    { option: "Toggle Windows", onclick: () => { console.log("click"); } }
];
export const runmenu = [
    { option: "Build", shortcut: "Ctrl + B", onclick: () => { console.log("click"); } },
    { option: "Run", shortcut: "Ctrl + F5", onclick: () => { console.log("click"); } },
    { option: "Run without debugging", shortcut: "F5", onclick: () => { console.log("click"); } },
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
    { option: "About Editor", onclick: async() => { console.log("click"); } },
];