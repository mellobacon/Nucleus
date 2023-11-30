import { homeDir, join } from "@tauri-apps/api/path";
import { themes } from "./extensionhandler";
import { info } from "tauri-plugin-log-api";
import { exists, readDir } from "@tauri-apps/api/fs";
import { get } from "svelte/store";

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

    info("Theme loaded sucessfully.", {file: "themehandler.ts", line: 35});
}
function processStyles(json) {
    const theme = Object.entries(json.theme);
    for (const entries of theme) {
        const category = entries[0];
        for (const property of Object.entries(entries[1])) {
            const name = property[0];
            let value = property[1];

            const cssValue = `${category}-${name}`;

            for (const style of stylesheet.style) {
                if (style === `--${cssValue}`) {
                    value = value === "" ? "transparent" : value;
                    stylesheet.style.setProperty(`--${cssValue}`, value);
                }
            }
        }
    }
}
export function getThemeProperty(styleName: string) {
    for (const style of stylesheet.style) {
        if (style === `--${styleName}`) {
            return stylesheet.style.getPropertyValue(style);
        }
    }
}
