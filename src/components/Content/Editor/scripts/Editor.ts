import langlist from "../../../../scripts/languages/languages.json";
import { languages } from "@codemirror/language-data";
import { writable } from 'svelte/store';

export let line_column = writable({line: "-", col: "-"});

let keys = Object.keys(langlist);
export function getLang(ext: string) {
    for (let key of keys) {
        let extensions = langlist[key].extensions;
        if (extensions && extensions.includes(`.${ext}`)) {
            return `${key}`;
        }
    }
}

export async function getLangMode(language: string) {
    // TODO: So apparently not every language is supported in CodeMirror. I need to find a way to support that
    let mode = languages.find(l => l.name === language);
    if (mode) {
        return await mode.load();
    }
    else {
        return [];
    }
}