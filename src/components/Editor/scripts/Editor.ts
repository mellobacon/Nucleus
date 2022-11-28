import langlist from "../../../scripts/languages/languages.json";
import { writable } from 'svelte/store';
import { languages as cmLangs } from "@codemirror/language-data";

let lang;
export let langsupported = writable(true);
export let limitedsupport = writable(false);
export let line_info = writable({line: "-", col: "-"});
export let file_language = writable("Plain Text");
export let file_linefeed = writable("-");
let keys = Object.keys(langlist);
export async function getLang(ext: string) {
    let language = "Unknown";
    let mode = null;
    if (ext === "") {
        ext = "txt";
    }
    let cmlang = cmLangs.find(l => l.extensions.includes(ext));
    
    // Check if theres official support for the language first before checking the json file
    if (cmlang) {
        language = cmlang.name;
        mode = await cmlang.load();
        langsupported.set(true);
    }
    else {
        for (let key of keys) {
            let extensions = langlist[key].extensions;
            if (extensions && extensions.includes(`.${ext}`)) {
                language = key;
                limitedsupport.set(true);
                break;
            }
            else {
                langsupported.set(false);
            }
        }
    }
    lang = {name: language, mode};
    file_language.set(language);
    return lang;
}

