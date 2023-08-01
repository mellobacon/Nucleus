import { append, copy, cut, deleteChars, redoChange, undoChange } from "../lib/Editor.svelte";
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
        "disabled": "true",
        "command": async () => {
            await undoChange();
        }
    },
    "redo": {
        "keybind": "Control+Shift+Z",
        "disabled": "true",
        "command": async () => {
            await redoChange();
        }
    },
    "cut": {
        "keybind": "Control+X",
        "disabled": "true",
        "command": async () => {
            await cut();
        }
    },
    "copy": {
        "keybind": "Control+C",
        "disabled": "true",
        "command": async () => {
           await copy();
        }
    },
    "paste": {
        "keybind": "Control+V",
        "disabled": "true",
        "command": async () => {
            const content = await navigator.clipboard.readText();
            append(content);
        }
    },
    "pasteFromHistory": {
        "keybind": "Control+Shift+V",
        "command": () => {
            //
        }
    },
    "delete": {
        "keybind": "Delete",
        "disabled": "true",
        "command": async () => {
            await deleteChars();
        }
    },
    "find": {
        "keybind": "Control+F",
        "command": () => {
            //
        }
    },
    "replace": {
        "keybind": "Control+H",
        "command": () => {
            //
        }
    },
    "openCommandPallete": {
        "keybind": "Control+Shift+P",
        "command": () => {
            //
        }
    },
    "zoomIn": {
        "keybind": "Control +",
        "command": () => {
            //
        }
    },
    "zoomOut": {
        "keybind": "Control -",
        "command": () => {
            //
        }
    },
    "fullscreen": {
        "keybind": "F11",
        "command": async () => {
            if (await appWindow.isFullscreen()) {
                appWindow.setFullscreen(false);
            }
            else {
                appWindow.setFullscreen(true);
            }
        }
    },
    "runFile": {
        "keybind": "F5",
        "command": () => {
            //
        }
    },
    "debugFile": {
        "keybind": "Control+F5",
        "command": () => {
            //
        }
    },
    "stopFile": {
        "keybind": "Shift+F5",
        "command": () => {
            //
        }
    },
    "openNewWindow": {
        "keybind": "Control+Shift+N",
        "command": () => {
            //
        }
    },
    "minimizeWindow": {
        "keybind": "",
        "command": () => {
            appWindow.minimize()
        }
    },
    "maximizeWindow": {
        "keybind": "",
        "command": async () => {
            if (await appWindow.isFullscreen()) {
                return;
            }
            if (await appWindow.isMaximized()) {
                appWindow.unmaximize();
            }
            else {
                appWindow.maximize()
            }
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
