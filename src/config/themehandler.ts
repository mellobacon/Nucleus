import { themes } from "./extensionhandler";
import { info } from "tauri-plugin-log-api";
import { get, writable } from "svelte/store";
import { termTheme, updateTermTheme } from "../lib/Terminal.svelte";
import { setColorScheme, setEditorTheme } from "../lib/Editor.svelte";
import { EditorView } from "@codemirror/view";
import { HighlightStyle } from "@codemirror/language"

export function getThemes() {
    return get(themes);
}

const stylesheet = document.styleSheets[0].cssRules[0] as CSSStyleRule;
export const is_dark_theme = writable(true);
export const editorTheme = writable(EditorView.theme({}));
export const editorHighlightStyle = writable(HighlightStyle.define([]))
export async function loadTheme(name: string) {
    let theme = get(themes).find(n => n.name === name);
    info(`Loading theme: ${name}...`, {file: "themehandler.ts", line: 16});
    is_dark_theme.set(theme.scheme === "dark");


    // load base theme
    let json = await import(`./extensions/default_themes/themes/default_${theme.scheme}.json`);
    let { tokenStyles } = await import(`./extensions/default_themes/script`);
    const tokens = tokenStyles[theme.scheme];
    processStyles(json);

    // load custom theme if it exists
    //const path = await join(await homeDir(), ".nucleus", "extensions");
    //if (await exists(path)) {
        //const custom_themes = await readDir(path);
    //}

    setColorScheme();
    termTheme.set({
        "black": getThemeProperty("terminal-black"),
        "red": getThemeProperty("terminal-red"),
        "green": getThemeProperty("terminal-green"),
        "yellow": getThemeProperty("terminal-yellow"),
        "blue": getThemeProperty("terminal-blue"),
        "magenta": getThemeProperty("terminal-magenta"),
        "cyan": getThemeProperty("terminal-cyan"),
        "white": getThemeProperty("terminal-white"),
        "brightBlack": getThemeProperty("terminal-brightBlack"),
        "brightRed": getThemeProperty("terminal-brightRed"),
        "brightGreen": getThemeProperty("terminal-brightGreen"),
        "brightYellow": getThemeProperty("terminal-brightYellow"),
        "brightBlue": getThemeProperty("terminal-brightBlue"),
        "brightMagenta": getThemeProperty("terminal-brightMagenta"),
        "brightCyan": getThemeProperty("terminal-brightCyan"),
        "brightWhite": getThemeProperty("terminal-brightWhite"),

        "background": getThemeProperty("terminal-background"),
        "foreground": getThemeProperty("terminal-foreground")
    })

    editorTheme.set(EditorView.theme(
        {
            "&": {
                color: getThemeProperty("editor-foreground"),
                backgroundColor: getThemeProperty("editor-background"),
            },
            ".cm-content": {
                caretColor: getThemeProperty("editor-foreground")
            },

            "&.cm-focused .cm-cursor": {
                borderLeftColor: getThemeProperty("editor-foreground")
            },

            "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
                backgroundColor: "#4d5054"
            },
            ".cm-activeLine": {
                backgroundColor: getThemeProperty("editor-activeLineBackground"),
            },
            ".cm-gutters": {
                backgroundColor: getThemeProperty("editor-background"),
                color: getThemeProperty("editor-gutterForeground"),
                border: "none"
            },
            ".cm-activeLineGutter": {
                backgroundColor: getThemeProperty("editor-gutterActiveBackground"),
                color: getThemeProperty("editor-gutterActiveForeground")
            },
            ".cm-tooltip": {
                border: "0.5px solid #292929",
                backgroundColor: getThemeProperty("editor-background"),
                color: getThemeProperty("window-foreground")
            },
            ".cm-tooltip-autocomplete": {
                "& > ul > li[aria-selected]": {
                    backgroundColor: getThemeProperty("editor-activeLineBackground"),
                    color: getThemeProperty("test-color")
                }
        }
        },
        { dark: true }
    ))
    editorHighlightStyle.set(HighlightStyle.define(tokens));

    setEditorTheme();
    updateTermTheme();

    info("Theme loaded sucessfully.", {file: "themehandler.ts", line: 35});
}
function processStyles(json) {
    const theme: any = Object.entries(json.theme);
    for (const entries of theme) {
        const [category, component] = entries[0].split(".");
        const property = `--${category}-${component}`;
        const value = entries[1] === "transparent" || "" ? "transparent" : entries[1];
        stylesheet.style.setProperty(property, value);
    }
}
export function getThemeProperty(styleName: string) {
    for (const style of stylesheet.style) {
        if (style === `--${styleName}`) {
            return stylesheet.style.getPropertyValue(style);
        }
    }
    return "purple";
}
