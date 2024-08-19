import { writable } from 'svelte/store';

export let themes = writable([]);
export async function getExtensions() {
    // get default themes
    let default_themes = [];
    let themes_dir = await import("./extensions/default_themes/package.json");
    let id = 0;
    for (let theme of themes_dir["theme"]) {
        let theme_data = {id: id++, name: theme['theme-name'], scheme: theme['color-scheme'], path: theme.path};
        default_themes = [...default_themes, theme_data];
    }
    themes.set(default_themes);
}
