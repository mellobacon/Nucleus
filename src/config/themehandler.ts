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
    let themefile = await import(`../config/themes/${name}-theme.json`);
    const theme = Object.entries(themefile.theme);
    for (const t of theme) {
        for (const p of Object.entries(t[1])) {
            const property = `${t[0]}.${p[0]}`;
            if (document.documentElement.style.getPropertyValue(property)) {
                document.documentElement.style.setProperty(`--${property}`, p[1]);
            }
        }
    }
}
