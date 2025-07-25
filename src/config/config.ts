import Mousetrap  from "mousetrap";
import { Commands } from "./commands";
import { ThemeHandler } from "./themehandler";

function parseKeybind(keybind: string) {
    const keys = keybind.split("+");
    const keymap = {
        "Shift": "shift",
        "Ctrl": "ctrl",
        "Alt": "alt",
        "Meta": "meta",
        "Backspace": "backspace",
        "Tab": "tab",
        "Enter": "enter",
        "Capslock": "capslock",
        "Escape": "escape",
        "Space": "space",
        "Pageup": "pageup",
        "Pagedown": "pagedown",
        "Home": "home",
        "Delete": "del",
        "End": "end",
        "+": "up",
        "-": "down"
    }
    for (const key of keys) {
        if (keymap[key]) {
            keybind = keybind.replace(key, keymap[key]);
        }
        else {
            keybind = keybind.replace(key, key.toLowerCase());
        }
    }
    return keybind;
}

function setShortcuts() {
    const shortcuts = Commands.getKeybinds();
    for (const shortcut of shortcuts) {
        if (shortcut.keybind.length === 0) {
            continue;
        }
        console.log(`loading shortcut: ${shortcut.keybind}`);
        // skip binding shorcuts that are disabled
        if (shortcut.disabled) {
            console.log(`${shortcut.keybind} disabled. skipping...`);
            continue;
        }
        const keybind = parseKeybind(shortcut.keybind);
        Mousetrap.bind(keybind, (e) => {
            e.preventDefault();
            fireAction(shortcut.command);
        })
    }
    console.log("shortcuts loaded (i think)");
}

async function fireAction(callback: () => Promise<void>, args = []) {
    await callback();
    return false;
}

export async function loadSettings() {
    setShortcuts();
    ThemeHandler.loadTheme("nucleus_gruv");
}

export function moveItemInArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    if (toIndex === fromIndex) {
        return array;
    }
    let copyArray = array;
    const target = copyArray[fromIndex];
    const increment = toIndex < fromIndex ? -1 : 1;

    for (let i = fromIndex; i !== toIndex; i += increment) {
        copyArray[i] = copyArray[i + increment];
    }
    copyArray[toIndex] = target;
    return copyArray;
}