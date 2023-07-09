import { writable } from "svelte/store";
import Mousetrap  from "mousetrap";
import { getKeybinds } from "./commands";
import { fs, path } from "@tauri-apps/api";
import { loadTheme } from "./themehandler";

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

export async function getSettings() {
    const settings = {
        "nucleus.theme": "dark",
        "editor.fontSize": 14,
        "editor.fontFamily": "Uno",
        "editor.autosave": false,
        "nucleus.showKeybinds": false,
        "nucleus.useExternalTerminal": true,
        "terminal.external": {
            "profile": "powershell"
        },
        "terminal.internal": {
            "profile": "powershell"
        },
    };
    const appdataLocal = await path.appLocalDataDir();

    if (!await fs.exists(`${appdataLocal}/settings.json`)) {
        await fs.writeFile(`${appdataLocal}/settings.json`, JSON.stringify(settings, null, "    "));
    }
}

export async function loadDefaultSettings() {
    await getSettings();
    const settings = JSON.parse(await fs.readTextFile("settings.json", {dir: fs.BaseDirectory.AppLocalData}));
    await loadTheme(settings["nucleus.theme"]);
	await getShortcuts();
}