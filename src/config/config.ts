import { writable } from "svelte/store";
import Mousetrap  from "mousetrap";
import { getKeybinds } from "./commands";

export const systemfonts = writable([]);
export const editorfont = writable("");
export const windowtheme = writable("");
export let font = "";
export const autosave = writable(false);

// mousetrap is outdated and i hate the lowercase keymaps but cba to go into the code and fix everything so this will do
function parseKeybind(keybind: string) {
    const keys = keybind.split("+");
    const keymap = {
        "Shift": "shift",
        "Control": "ctrl",
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

export async function getShortcuts() {
    const shortcuts = getKeybinds();
    for (const shortcut of shortcuts) {
        const keybind = parseKeybind(shortcut.keybind);
        Mousetrap.bind(keybind, async (e) => {e.preventDefault(); await fireAction(shortcut.command)});
    }
}

async function fireAction(callback: () => Promise<void>, args = []) {
    await callback();
    return false;
}
