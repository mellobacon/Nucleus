<script lang="ts">
    import { Compartment, EditorState } from "@codemirror/state";
    import { drawSelection, highlightActiveLine, lineNumbers, highlightActiveLineGutter, keymap, EditorView, type Panel, showPanel } from "@codemirror/view";
    import { defaultKeymap, history, historyKeymap, indentWithTab} from "@codemirror/commands";
    import { searchKeymap } from "@codemirror/search";
    import { onMount, tick } from "svelte";
    import { getTabs } from "./components/Tabs/EditorTabs.svelte";
    import { get, writable, type Writable } from "svelte/store";
    import { javascript } from "@codemirror/lang-javascript"
    import { autocompletion } from "@codemirror/autocomplete"
    import { codeFolding, HighlightStyle, syntaxHighlighting } from "@codemirror/language";
    import { editorSearch, foldGutters, highlightNewLine, highlightWhiteSpace, indentMarkers } from "../scripts/editor";

    let editor: HTMLElement;
    export let hidden = false;

    let editorView: EditorView;
    const theme = new Compartment();
    const highlighting = new Compartment();

    export function setTheme() {
        editorView.dispatch({
            effects: theme.reconfigure([get(editorTheme)])
        })
    }
    export function setHighlighting() {
        editorView.dispatch({
            effects: highlighting.reconfigure(syntaxHighlighting(get(editorHighlighting)))
        })
    }

    export async function focusEditor() {
        await tick();
        await tick();
        editorView.focus();
        updateLineInfo();
    }

    export function updateLineInfo() {
        let lineNumber = editorView.state.doc.lineAt(editorView.state.selection.main.head).number;
        let columnNumber = editorView.state.selection.ranges[0].head - editorView.state.doc.lineAt(editorView.state.selection.main.head).from;
        line_info.set({ln: lineNumber, col: columnNumber + 1});
    }

    async function handleKeyDown(e) {
        let key = e.code;
        switch(key) {
            case "ArrowRight": case "ArrowLeft": case "ArrowDown": case "ArrowUp":
                updateLineInfo();
        }
    }

    function createEditor() {
        editorView = new EditorView({
            parent: editor,
            state: EditorState.create({
                extensions: [
                    lineNumbers(),
                    highlightActiveLineGutter(),
                    highlightActiveLine(),
                    drawSelection({cursorBlinkRate: 1000}),
                    highlightNewLine(),
                    highlightWhiteSpace(),
                    javascript(),
                    highlighting.of([]),
                    autocompletion({closeOnBlur: false}),
                    codeFolding(),
                    theme.of([]),
                    showPanel.of(panel),
                    editorSearch(),
                    keymap.of([
                        ...defaultKeymap,
                        ...searchKeymap,
                        ...historyKeymap,
                        indentWithTab
                    ]),
                    foldGutters(),
                    history(),
                    EditorView.updateListener.of(update => {
                        if (update.docChanged) {
                            updateLineInfo();
                        }
                        if (update.state.selection.ranges.some(r => !r.empty)) {
                            updateLineInfo();
                        }
                    })
                ]   
            })
        })
        editorV.set(editorView);
        editorView.contentDOM.classList.add("mousetrap"); // allow keybinds on input focus
    }
    function panel(): Panel {
        let div = document.createElement("div");
        div.className = "editor-panel";

        let span = document.createElement("span");
        span.textContent = "test/test/test/set/est/set";

        div.appendChild(span);
        return {top: true, dom: div}
    }
    onMount(() => {
        createEditor();
        setTheme();
        setHighlighting();
    })
</script>

<script lang="ts" context="module">
    export let editorTheme = writable(EditorView.theme({}));
    export let editorHighlighting: Writable<HighlightStyle> = writable();
    export let editorV: Writable<EditorView> = writable();
    
    export let line_info = writable({ln: 0, col: 0});
    
    export function setEditorTheme() {
        for (const tab of getTabs()) {
            if (get(tab.isfile)) {
                tab.content.setTheme();
                tab.content.setHighlighting();
            }
        }
    }
</script>

<div bind:this={editor} class="editor" class:hidden on:mousedown={updateLineInfo} on:keydown={handleKeyDown} role="textbox" tabindex="0"></div>

<style lang="scss">
    .editor {
        height: 100%;
        width: 100%;
        &.hidden {
            display: none;
        }
        :global(.editor-panel) {
            font-size: 0.8rem;
            padding: 8px 5px;
            display: flex;
            align-items: center;
            line-height: normal;
        }
        :global(.monaco-scrollable-element > .scrollbar > .slider) {
            background-color: var(--window-scrollbarBackground);
            &:hover {
                background-color: #1b83ddb5;
            }
        }
        :global(.monaco-scrollable-element > .scrollbar):not(.horizontal) {
            width: 12px !important;
            &> :global(.slider) {
                width: 12px !important;
            }
        }
        :global(.monaco-scrollable-element > .scrollbar.horizontal) {
            height: 12px !important;
            &> :global(>.slider) {
                height: 12px !important;
            }
        }

        :global(.cm-editor:focus),
        :global(.cm-focused) {
            outline: none !important;
        }
        :global(.cm-editor),
        :global(.cm-wrap) {
            height: 100%;
        }
        :global(.cm-scroller) {
            font-size: 14px !important;
            line-height: 1.3 !important;
            padding-top: 7px;
            overflow-y: overlay;
            overflow-x: overlay !important;
            width: -webkit-fill-available;
            height: -webkit-fill-available !important;
            font-family: "JetBrains Mono"
        }
        :global(.cm-gutters) {
            z-index: 2;
        }
        :global(.cm-content) {
            padding: 0 0px 200px 0 !important;
        }
        :global(.cm-lineNumbers) {
            min-width: 65px !important;
            &:hover {
                ~:global(.cm-foldGutter) {
                    opacity: 100;
                    pointer-events: all;
                }
            }
        }
        :global(.cm-gutterElement) {
            text-align: center !important;
        }
        :global(.cm-foldGutter) {
            position: absolute;
            left: 49px;
            pointer-events: none;
            opacity: 0;
            transition: 0.4s;
            &:hover {
                opacity: 100;
                pointer-events: all;
            }
        }
        :global(.cm-indent-markers)::before {
            z-index: 0 !important;
        }
        :global(.cm-line) {
            padding: 0 2px 0 1px !important;
        }
        :global(.cm-whitespace) {
            opacity: 0.3;
        }
    }
</style>


