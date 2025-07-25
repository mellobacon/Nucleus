import { Commands } from "../config/commands";
import { writable } from 'svelte/store';

export type MenuItem = {
    menu?: string;
    icon?: any;
    children: { 
        name: string;
        shortcut?: string; 
        action: any; 
        disabled?: boolean;
        children?: any;
        divider?: boolean;
    }[];
}

export const activeMenu = writable<MenuItem>(null);
export class Menu {
    readonly items: MenuItem[] = [];
    constructor() {
        this.items = [
            {menu: "File", children: [
                {name: "New File...", shortcut: Commands.commands.createNewFile.keybind, action: Commands.commands.createNewFile.command, disabled: Commands.commands.createNewFile.disabled},
                {name: "New Window", shortcut: Commands.commands.createNewWindow.keybind, action: Commands.commands.createNewWindow.command, disabled: Commands.commands.createNewWindow.disabled},
                {name: "Open File...", shortcut: Commands.commands.openFile.keybind, action: Commands.commands.openFile.command, disabled: Commands.commands.openFile.disabled, divider: true},
                {name: "Open Folder", shortcut: Commands.commands.openFolder.keybind, action: Commands.commands.openFolder.command, disabled: Commands.commands.openFolder.disabled},
                {name: "Open Recents", shortcut: Commands.commands.openRecents.keybind, action: Commands.commands.openRecents.command, disabled: Commands.commands.openRecents.disabled},
                {name: "Save", shortcut: Commands.commands.saveFile.keybind, action: Commands.commands.saveFile.command, disabled: Commands.commands.saveFile.disabled, divider: true},
                {name: "Save As...", shortcut: Commands.commands.saveFileAs.keybind, action: Commands.commands.saveFileAs.command, disabled: Commands.commands.saveFileAs.disabled},
                {name: "Save All", shortcut: Commands.commands.saveAll.keybind, action: Commands.commands.saveAll.command, disabled: Commands.commands.saveAll.disabled},
                {name: "Settings", shortcut: Commands.commands.openSettings.keybind, action: Commands.commands.openSettings.command, disabled: Commands.commands.openSettings.disabled, divider: true},
                {name: "Exit", shortcut: Commands.commands.exitNucleus.keybind, action: Commands.commands.exitNucleus.command, disabled: Commands.commands.exitNucleus.disabled, divider: true}
            ]},
            {menu: "Edit", children: [
                {name: "Undo", shortcut: Commands.commands.undo.keybind, action: Commands.commands.undo.command, disabled: Commands.commands.undo.disabled},
                {name: "Redo", shortcut: Commands.commands.redo.keybind, action: Commands.commands.redo.command, disabled: Commands.commands.redo.disabled},
                {name: "Cut", shortcut: Commands.commands.cut.keybind, action: Commands.commands.cut.command, disabled: Commands.commands.cut.disabled, divider: true},
                {name: "Copy", shortcut: Commands.commands.copy.keybind, action: Commands.commands.copy.command, disabled: Commands.commands.copy.disabled},
                {name: "Delete", shortcut: Commands.commands.delete.keybind, action: Commands.commands.delete.command, disabled: Commands.commands.delete.disabled},
                {name: "Paste", shortcut: Commands.commands.paste.keybind, action: Commands.commands.paste.command, disabled: Commands.commands.paste.disabled},
                {name: "Paste From History...", shortcut: Commands.commands.pasteFromHistory.keybind, action: Commands.commands.pasteFromHistory.command, disabled: Commands.commands.pasteFromHistory.disabled},
                {name: "Find", shortcut: Commands.commands.find.keybind, action: Commands.commands.find.command, disabled: Commands.commands.find.disabled, divider: true},
                {name: "Replace", shortcut: Commands.commands.replace.keybind, action: Commands.commands.replace.command, disabled: Commands.commands.replace.disabled},
            ]},
            {menu: "View", children: [
                {name: "Toggle Fullscreen", shortcut: Commands.commands.fullscreen.keybind, action: Commands.commands.fullscreen.command, disabled: Commands.commands.fullscreen.disabled},
                {name: "Command Pallete", shortcut: Commands.commands.openCommandPallete.keybind, action: Commands.commands.openCommandPallete.command, disabled: Commands.commands.openCommandPallete.disabled}
            ]},
            {menu: "Help", children: [
                {name: "Welcome", shortcut: "", action: ()=>{}, disabled: true},
                {name: "Send Feedback", shortcut: "", action: ()=>{}, disabled: true},
                {name: "Contact Support", shortcut: "", action: ()=>{}, disabled: true},
                {name: "Report Issue", shortcut: "", action: ()=>{}, disabled: true},
                {name: "Documentation", shortcut: null, action: null, disabled: true},
                {name: "About", shortcut: "", action: ()=>{}, disabled: true}
            ]}
        ]
    } 

    add(item: MenuItem) {
        this.items.push(item);
    }
    getItems() {
        return this.items;
    }
}