import { addEditorTab } from "../lib/EditorTabList.svelte";
import { saveFile, openFile, openFolder } from "../lib/File";
import { appWindow } from "@tauri-apps/api/window";

export const commands = {
    "addEditorTab": {
        "keybind": "Control+N",
        "command": () => {
            addEditorTab();
        }
    },
    "openFile": {
        "keybind": "Control+O",
        "command": async () => {
            await openFile();
        }
    },
    "openFolder": {
        "keybind": "Control+K",
        "command": async () => {
            await openFolder();
        }
    },
    "saveFile": {
        "keybind": "Control+S",
        "command": async () => {
            await saveFile();
        }
    },
    "saveFileAs": {
        "keybind": "Control+Shift+S",
        "command": async () => {
            await saveFile(true);
        }
    },
    "undo": {
        "keybind": "Control+Z",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "redo": {
        "keybind": "Control+Shift+Z",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "cut": {
        "keybind": "Control+X",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "copy": {
        "keybind": "Control+C",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "paste": {
        "keybind": "Control+V",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "pasteFromHistory": {
        "keybind": "Control+Shift+V",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "delete": {
        "keybind": "Delete",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "find": {
        "keybind": "Control+F",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "replace": {
        "keybind": "Control+H",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "openCommandPallete": {
        "keybind": "Control+Shift+P",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "zoomIn": {
        "keybind": "Control +",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "zoomOut": {
        "keybind": "Control -",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "fullscreen": {
        "keybind": "F11",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "runFile": {
        "keybind": "F5",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "debugFile": {
        "keybind": "Control+F5",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "stopFile": {
        "keybind": "Shift+F5",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "openNewWindow": {
        "keybind": "Control+Shift+N",
        "command": () => {
            console.warn("Feature not implemented yet.")
        }
    },
    "closeWindow": {
        "keybind": "Alt+F4",
        "command": async () => {
            await appWindow.close();
        }
    }
}

export function registerCommand(name: string, keybind: string, command: () => void) {
    if (commands[name]) {
        console.warn(`Command "${name}" already exists, skipping.`);
        return;
    }
    commands[name] = { "keybind": keybind, "command": command }
}

let keybinds = []
export function getKeybinds() {
    for (const value of Object.values(commands)) {
        if (!keybinds.includes(value)) {
            keybinds = [...keybinds, value];
        }
    }
    return keybinds;
}
