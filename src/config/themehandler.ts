import { themes } from "./themes/themes";
import { info } from "tauri-plugin-log-api";

export function getThemes() {
    let themelist = [];
    let id = 0;
    for (const theme of themes) {
        themelist = [...themelist, {id: id, name: theme["theme-name"]}];
        id++;
    }
    return themelist;
}

const stylesheet = document.styleSheets[0].cssRules[0] as CSSStyleRule;
export async function loadTheme(name: string) {
    info(`Loading theme: ${name}...`, {file: "themehandler.ts", line: 16});
    let json = await import(`../config/themes/${name.toLowerCase()}-theme.json`);
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
    info("Theme loaded sucessfully.", {file: "themehandler.ts", line: 35});
}
export function getThemeProperty(styleName: string) {
    for (const style of stylesheet.style) {
        if (style === `--${styleName}`) {
            return stylesheet.style.getPropertyValue(style);
        }
    }
}
