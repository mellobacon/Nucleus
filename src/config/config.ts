import { writable } from "svelte/store";
import Mousetrap  from "mousetrap";
import { getKeybinds } from "./commands";
import { fs, path } from "@tauri-apps/api";
import { loadTheme } from "./themehandler";
import { Store } from "tauri-plugin-store-api";
import { setEditorFontFamily, setEditorFontSize } from "../lib/Editor.svelte";
import { watch } from "tauri-plugin-fs-watch-api";
import { getActiveTab } from "../lib/EditorTabList.svelte";

export const systemfonts = writable([]);
export const editorfont = writable("");
export const windowtheme = writable("");
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
        Mousetrap.bind(keybind, async (e) => {
            // prevent editor functions firing outside editor instances
            if (getActiveTab().isfile) {
                e.preventDefault();
            }
            else {
                return;
            }
            await fireAction(shortcut.command);
        });
    }
}

async function fireAction(callback: () => Promise<void>, args = []) {
    await callback();
    return false;
}

export let appSettings: Store;
export async function getSettings() {
    const settings = JSON.stringify({
        "nucleus.theme": "Dark",
        "editor.fontSize": 14,
        "editor.fontFamily": "monospace",
        "editor.autosave": false,
        "nucleus.showKeybinds": false,
        "nucleus.useExternalTerminal": true,
        "terminal.external": {
            "profile": "powershell"
        },
        "terminal.internal": {
            "profile": "powershell"
        },
    }, null, 4);
    const appdataLocal = await path.appLocalDataDir();
    const settingsPath = `${appdataLocal}settings.json`;

    if (!await fs.exists(settingsPath)) {
        await fs.writeFile(settingsPath, settings);
    }
    appSettings = new Store(settingsPath);

    await watch(
        settingsPath,
        async () => {
            await appSettings.load();
        }
    )
}

export async function loadDefaultSettings() {
    await getSettings();
    const settingsPath = await fs.readTextFile("settings.json", {dir: fs.BaseDirectory.AppLocalData});
    const settings = JSON.parse(settingsPath);
    await loadTheme(settings["nucleus.theme"]);
	await getShortcuts();
    appSettings.onKeyChange("editor.fontSize", (value: number) => {
        setEditorFontSize(value);
    })
    appSettings.onKeyChange("editor.fontFamily", (value: string) => {
        setEditorFontFamily(value);
    })
    appSettings.onKeyChange("nucleus.theme", async (value: string) => {
        await loadTheme(value);
    })
}