import { filetree, workspacename } from "../FileTree/scripts/TreeStore";
import { data, workspace } from "../FileTree/scripts/TreeData";
import { addTab } from "../Content/Editor/scripts/Tabs";
import { dialog } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
export const filemenu = [
    { option: "New File...", shortcut: "Ctrl + N", onclick: async () => { console.log("click"); } },
    { option: "Open File...", shortcut: "Ctrl + O", onclick: async () => { 
        let f = await dialog.open() as string;
        await addTab(f);
     } },
    { option: "Open Folder", shortcut: "Ctrl + K", onclick: async () => { 
        let treedata = await data();
        if (treedata === undefined) return;
        filetree.set(treedata);
        workspacename.set(workspace());
    }},
    { option: "Open Recent", onclick: () => { console.log("click"); } },
    { option: "Save File", shortcut: "Ctrl + S", onclick: () => { console.log("click"); }, divider: true },
    { option: "Save File As...", shortcut: "Ctrl + Shift + S", onclick: () => { console.log("click"); } },
    { option: "Save All", shortcut: "Ctrl + Shift + K", onclick: () => { console.log("click"); } },
    { option: "Settings", onclick: () => { console.log("click"); }, divider: true },
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