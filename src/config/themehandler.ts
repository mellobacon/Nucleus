import { EditorView } from "@codemirror/view";
import { terminalInstance, terminalTheme } from "../lib/components/Terminal.svelte";
import { editorHighlighting, editorTheme, setEditorTheme } from "../lib/Editor.svelte";
import { get } from "svelte/store";
import { darkHighlighting, lightHighlighting } from "./styles/syntaxhighlighting";

export class ThemeHandler {
    static stylesheet = document.styleSheets[0].cssRules[0] as CSSStyleRule;
    static async loadTheme(name: string) {
        console.log("Loading theme: " + name);
        let json = await import(`./styles/${name}.json`);
        this.processStyles(json);
 
        terminalTheme.set({
            "black": this.getThemeProperty("terminal-black"),
            "red": this.getThemeProperty("terminal-red"),
            "green": this.getThemeProperty("terminal-green"),
            "yellow": this.getThemeProperty("terminal-yellow"),
            "blue": this.getThemeProperty("terminal-blue"),
            "magenta": this.getThemeProperty("terminal-magenta"),
            "cyan": this.getThemeProperty("terminal-cyan"),
            "white": this.getThemeProperty("terminal-white"),
            "brightBlack": this.getThemeProperty("terminal-brightBlack"),
            "brightRed": this.getThemeProperty("terminal-brightRed"),
            "brightGreen": this.getThemeProperty("terminal-brightGreen"),
            "brightYellow": this.getThemeProperty("terminal-brightYellow"),
            "brightBlue": this.getThemeProperty("terminal-brightBlue"),
            "brightMagenta": this.getThemeProperty("terminal-brightMagenta"),
            "brightCyan": this.getThemeProperty("terminal-brightCyan"),
            "brightWhite": this.getThemeProperty("terminal-brightWhite"),

            "background": this.getThemeProperty("terminal-background"),
            "foreground": this.getThemeProperty("terminal-foreground")
        })
        editorTheme.set(EditorView.theme(
            {
                "&": {
                    color: ThemeHandler.getThemeProperty("editor-foreground"),
                    backgroundColor: ThemeHandler.getThemeProperty("editor-background"),
                },
                ".cm-content": {
                    caretColor: ThemeHandler.getThemeProperty("editor-foreground")
                },

                "&.cm-focused .cm-cursor": {
                    borderLeftColor: ThemeHandler.getThemeProperty("editor-foreground"),
                    borderLeftWidth: "2px"
                },
                ".cm-selectionBackground, ::selection": {
                    backgroundColor: ThemeHandler.getThemeProperty("editor-selectBackground"),
                },
                "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
                    backgroundColor: ThemeHandler.getThemeProperty("editor-selectActiveBackground"),
                },
                ".cm-activeLine": {
                    backgroundColor: ThemeHandler.getThemeProperty("editor-activeLineBackground"),
                },
                ".cm-gutters": {
                    backgroundColor: ThemeHandler.getThemeProperty("editor-background"),
                    color: ThemeHandler.getThemeProperty("editor-gutterForeground"),
                    border: "none"
                },
                ".cm-activeLineGutter": {
                    backgroundColor: ThemeHandler.getThemeProperty("editor-gutterActiveBackground"),
                    color: ThemeHandler.getThemeProperty("editor-gutterActiveForeground")
                },
                ".cm-tooltip": {
                    border: `1px solid ${ThemeHandler.getThemeProperty("editor-tooltipBorder")}`,
                    backgroundColor: ThemeHandler.getThemeProperty("editor-tooltipBackground"),
                    color: ThemeHandler.getThemeProperty("editor-tooltipForeground"),
                },
                ".cm-tooltip-autocomplete": {
                    "& > ul": {
                        maxHeight: "12em !important",
                        fontWeight: "500"
                    },
                    "& > ul > li[aria-selected]": {
                        backgroundColor: ThemeHandler.getThemeProperty("editor-tooltipActiveBackground"),
                        color: ThemeHandler.getThemeProperty("editor-tooltipActiveForeground")
                    },
                    "& > ul > li": {
                        padding: "2px 3px !important"
                    }
                },
                ".cm-completionMatchedText": {
                    textDecoration: "none",
                    color: ThemeHandler.getThemeProperty("editor-tooltipCompletionForeground")
                },
                "&.cm-focused .cm-matchingBracket": {
                    backgroundColor: "transparent",
                    outline: "0.5px solid #5c5c5c"
                },
                ".cm-panels": {
                    color: ThemeHandler.getThemeProperty("window-foreground"),
                    background: ThemeHandler.getThemeProperty("editor-background"),
                    zIndex: "0"
                },
                ".cm-panels-top": {
                    borderBottom: "none"
                },
                ".cm-panels-top .cm-panel": {
                    borderBottom: `1px solid ${ThemeHandler.getThemeProperty("window-borderColor")}`
                },
                ".cm-foldGutter": {
                    marginLeft: "-15px",
                    marginRight: "5px",
                    padding: "0 10px",
                    color: ThemeHandler.getThemeProperty("editor-gutterActiveForeground"),
                    opacity: "100"
                },
                ".cm-foldPlaceholder": {
                    border: "none",
                    backgroundColor: "transparent"
                }
            },
        ))
        if (json.scheme === "dark") {
            editorHighlighting.set(darkHighlighting);
        }
        else {
            editorHighlighting.set(lightHighlighting);
        }
        
        let terminal = get(terminalInstance);
        if (terminal) {
            terminal.updateTheme();
        }
        setEditorTheme();
    }
    private static processStyles(json) {
        const theme: any = Object.entries(json.theme);
        for (const entries of theme) {
            const [category, component] = entries[0].split(".");
            const property = `--${category}-${component}`;
            const value = entries[1] === "transparent" || "" ? "transparent" : entries[1];
            this.stylesheet.style.setProperty(property, value);
        }
    }
    static getThemeProperty(styleName: string) {
        for (const style of this.stylesheet.style) {
            if (style === `--${styleName}`) {
                return this.stylesheet.style.getPropertyValue(style);
            }
        }
    }
}