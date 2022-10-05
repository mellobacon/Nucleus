import langlist from "../../../../scripts/languages/languages.json";

let keys = Object.keys(langlist);
export function getLang(ext: string) {
    for (let key of keys) {
        let extensions = langlist[key].extensions;
        if (extensions && extensions.includes(`.${ext}`)) {
            return `${key}`;
        }
    }
}
