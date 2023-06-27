import { themes } from "./themes/themes";

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
}
export function getThemeProperty(styleName: string) {
    for (const style of stylesheet.style) {
        if (style === `--${styleName}`) {
            return stylesheet.style.getPropertyValue(style);
        }
    }
}
