import { getCurrentWindow } from '@tauri-apps/api/window';
import { get } from 'svelte/store';
import { terminalInstance } from '../lib/components/Terminal.svelte';
import { addEditorTab } from '../lib/components/Tabs/EditorTabs.svelte';

const appWindow = getCurrentWindow();

type CommandObject = {
    name: string;
    keybind: string;
    disabled: boolean;
    command: void;
}

export class Commands {
    static readonly keybinds = [];
    static readonly commands = {
        "minimizeWindow": {
            "keybind": "",
            "disabled": false,
            "command": () => {
                appWindow.minimize();
                get(terminalInstance).fitTerminal();
            }
        },
        "maximizeWindow": {
            "keybind": "",
            "disabled": false,
            "command": async () => {
                appWindow.toggleMaximize();
                get(terminalInstance).fitTerminal();
            }
        },
        "closeWindow": {
            "keybind": "Alt+F4",
            "disabled": false,
            "command": async () => {
                appWindow.close()
            }
        },
        "fullscreen": {
            "keybind": "F11",
            "disabled": false,
            "command": async () => {
                if (await appWindow.isFullscreen()) {
                    appWindow.setFullscreen(false);
                }
                else {
                    appWindow.setFullscreen(true);
                }
            }
        },
        "commandPalette": {
            "keybind": "Ctrl+Shift+P",
            "disabled": false,
            "command": () => {}
        },
        "createNewFile": {
            "keybind": "Ctrl+N",
            "disabled": false,
            "command": () => {
                addEditorTab();
            }
        },
        "createNewWindow": {
            "keybind": "Ctrl+Shift+N",
            "disabled": false,
            "command": () => {}
        },
        "openFile": {
            "keybind": "Ctrl+O",
            "disabled": false,
            "command": () => {}
        },
        "openFolder": {
            "keybind": "Ctrl+K",
            "disabled": false,
            "command": () => {}
        },
        "openRecents": {
            "keybind": "Ctrl+Shift+R",
            "disabled": false,
            "command": () => {}
        },
        "saveFile": {
            "keybind": "Ctrl+S",
            "disabled": false,
            "command": () => {}
        },
        "saveFileAs": {
            "keybind": "Ctrl+Shift+S",
            "disabled": false,
            "command": () => {}
        },
        "saveAll": {
            "keybind": "Ctrl+K S",
            "disabled": false,
            "command": () => {}
        },
        "openSettings": {
            "keybind": "",
            "disabled": false,
            "command": () => {}
        },
        "exitNucleus": {
            "keybind": "",
            "disabled": false,
            "command": () => {}
        },

        "undo": {
            "keybind": "Ctrl+Z",
            "disabled": false,
            "command": () => {}
        },
        "redo": {
            "keybind": "Ctrl+Y",
            "disabled": false,
            "command": () => {}
        },
        "cut": {
            "keybind": "Ctrl+X",
            "disabled": false,
            "command": () => {}
        },
        "copy": {
            "keybind": "Ctrl+C",
            "disabled": false,
            "command": () => {}
        },
        "delete": {
            "keybind": "Delete",
            "disabled": false,
            "command": () => {}
        },
        "paste": {
            "keybind": "Ctrl+V",
            "disabled": false,
            "command": () => {}
        },
        "pasteFromHistory": {
            "keybind": "",
            "disabled": false,
            "command": () => {}
        },
        "find": {
            "keybind": "Ctrl+F",
            "disabled": false,
            "command": () => {}
        },
        "replace": {
            "keybind": "Ctrl+H",
            "disabled": false,
            "command": () => {}
        },

        "openCommandPallete": {
            "keybind": "Ctrl+Shift+P",
            "disabled": false,
            "command": () => {}
        }
    }
    /**
     *  Registers a command
     *  @param {CommandObject} option - Command object or something idk
     */
    static registerCommand(option: CommandObject) {
        if (this.commands[option.name]) {
            return;
        }
        this.commands[option.name] = { "keybind": option.keybind, "disabled": option.disabled, "command": option.command }
    }
    static getKeybinds() {
        for (const value of Object.values(this.commands)) {
            if (!this.keybinds.includes(value)) {
                this.keybinds.push(value);
            }
        }
        return this.keybinds;
    }
}