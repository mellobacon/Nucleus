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

export async function loadTheme(name: string) {
    let json = await import(`../config/themes/${name.toLowerCase()}-theme.json`);
    const theme = Object.entries(json.theme);
    for (const entries of theme) {
        const category = entries[0];
        for (const property of Object.entries(entries[1])) {
            const name = property[0];
            const value = property[1];

            const cssValue = `${category}-${name}`;
            if (getComputedStyle(document.documentElement).getPropertyValue(`--${cssValue}`)) {
                document.documentElement.style.setProperty(`--${cssValue}`, value);
                //console.log(cssValue + ": " + value);
            }
        }
    }
}
