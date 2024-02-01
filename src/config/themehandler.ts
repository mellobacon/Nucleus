import { homeDir, join } from "@tauri-apps/api/path";
import { themes } from "./extensionhandler";
import { info } from "tauri-plugin-log-api";
import { exists, readDir } from "@tauri-apps/api/fs";
import { get } from "svelte/store";
import { termTheme, updateTermTheme } from "../lib/Terminal.svelte";

export function getThemes() {
    return get(themes);
}

const stylesheet = document.styleSheets[0].cssRules[0] as CSSStyleRule;
export async function loadTheme(name: string) {
    let theme = get(themes).find(n => n.name === name);
    info(`Loading theme: ${name}...`, {file: "themehandler.ts", line: 16});

    // load base theme
    let json = await import(`./extensions/default_themes/themes/default_${theme.scheme}.json`);
    processStyles(json);

    // load custom theme if it exists
    //const path = await join(await homeDir(), ".nucleus", "extensions");
    //if (await exists(path)) {
        //const custom_themes = await readDir(path);
    //}

    termTheme.set({
        "black": getThemeProperty("terminal-black"),
        "red": getThemeProperty("terminal-red"),
        "green": getThemeProperty("terminal-green"),
        "yellow": getThemeProperty("terminal-yellow"),
        "blue": getThemeProperty("terminal-blue"),
        "magenta": getThemeProperty("terminal-magenta"),
        "cyan": getThemeProperty("terminal-cyan"),
        "white": getThemeProperty("terminal-white"),
        "brightBlack": getThemeProperty("terminal-brightBlack"),
        "brightRed": getThemeProperty("terminal-brightRed"),
        "brightGreen": getThemeProperty("terminal-brightGreen"),
        "brightYellow": getThemeProperty("terminal-brightYellow"),
        "brightBlue": getThemeProperty("terminal-brightBlue"),
        "brightMagenta": getThemeProperty("terminal-brightMagenta"),
        "brightCyan": getThemeProperty("terminal-brightCyan"),
        "brightWhite": getThemeProperty("terminal-brightWhite"),

        "background": getThemeProperty("terminal-background"),
        "foreground": getThemeProperty("terminal-foreground")
    })

    updateTermTheme();

    info("Theme loaded sucessfully.", {file: "themehandler.ts", line: 35});
}
function processStyles(json) {
    const theme: any = Object.entries(json.theme);
    for (const entries of theme) {
        const [category, component] = entries[0].split(".");
        const property = `--${category}-${component}`;
        const value = entries[1] === "transparent" || "" ? "transparent" : entries[1];
        stylesheet.style.setProperty(property, value);
    }
}
export function getThemeProperty(styleName: string) {
    for (const style of stylesheet.style) {
        if (style === `--${styleName}`) {
            return stylesheet.style.getPropertyValue(style);
        }
    }
    return "purple";
}
