import { WidgetType, ViewPlugin, type DecorationSet, Decoration, ViewUpdate, EditorView, highlightSpecialChars } from "@codemirror/view"
import { indentationMarkers } from "@replit/codemirror-indentation-markers"
import { ThemeHandler } from "../config/themehandler"
import { search } from "@codemirror/search";
import { foldGutter } from "@codemirror/language";
import { showNewLines, showWhiteSpace } from "../config/configStore";
import { get } from "svelte/store";
import { Compartment } from "@codemirror/state";

class NewlineWidget extends WidgetType {
    toDOM() {
        const span = document.createElement('span')
        span.className = 'cm-whitespace'
        span.textContent = '↵'
        return span
    }
}
export function highlightNewLine() {
    return ViewPlugin.fromClass(
        class {
            decorations: DecorationSet
            constructor(view: EditorView) {
                this.decorations = this.getDecorations(view)
            }

            getDecorations(view: EditorView) {
                const widgets = [];
                const doc = view.state.doc;
                for (let pos = 0; pos < doc.length; pos++) {
                    if (doc.sliceString(pos, pos + 1) === '\n' && get(showNewLines)) {
                        widgets.push(Decoration.widget({ widget: new NewlineWidget(), side: 1 }).range(pos));
                    }
                }
                return Decoration.set(widgets, true);
            }

            update(update: ViewUpdate) {
                if (update.docChanged) {
                    this.decorations = this.getDecorations(update.view);
                }
            }
        },
        { decorations: v => v.decorations }
    )
}
export function highlightWhiteSpace() {
    if (!get(showWhiteSpace)) {
        return new Compartment().of([]);
    }
    return highlightSpecialChars({
        render: (code, description, placeholder) => {
            let span = document.createElement("span");
            span.className = 'cm-whitespace'
            span.textContent = placeholder;
            return span;
        },
        specialChars: /\s/g,
    })
}
export function indentMarkers() {
    return indentationMarkers({
        colors: {
            dark: ThemeHandler.getThemeProperty("editor-gutterForeground"),
            activeDark: ThemeHandler.getThemeProperty("editor-activeIndentLineColor"),
            light: ThemeHandler.getThemeProperty("editor-gutterForeground"),
            activeLight: ThemeHandler.getThemeProperty("editor-activeIndentLineColor")
        }
    })
}

export function editorSearch() {
    import("../lib/components/EditorPanels/SearchPanel.svelte");
    return search({
        caseSensitive: false,
        scrollToMatch: range => EditorView.scrollIntoView(range),
        createPanel: view => ({ 
            top: true,
            dom: document.createElement("search-panel")
        })
    })
}

export function foldGutters() {
    import("../assets/icons/chevron_down.svelte");
    import("../assets/icons/chevron_right.svelte");
    return foldGutter ({
        markerDOM: open => {
            let icon = open ? document.createElement("chevron-down") : document.createElement("chevron-right");
            icon.className = "cm-fold-icon"
            return icon;
        }
    })
}