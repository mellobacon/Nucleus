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

/*export async function loadTheme() {
    let theme = await import("../config/themes/dark-theme.json");
    return theme.theme;
}*/