<script lang="ts">
    import {keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
        rectangularSelection, crosshairCursor,
        lineNumbers, highlightActiveLineGutter, EditorView} from "@codemirror/view"
    import {EditorState } from "@codemirror/state"
    import {defaultHighlightStyle, syntaxHighlighting} from "@codemirror/language"
    import {defaultKeymap, history, historyKeymap, indentWithTab} from "@codemirror/commands"
    import {searchKeymap} from "@codemirror/search"
    import { onMount, tick } from "svelte";
    import { writable } from "svelte/store";
    import { updateSaveState } from "./File";

    let ref;
    let editorView: EditorView;
    export let hidden = false;
    export let content = "";
    const file_info = writable({
        "filename": "",
        "path": "",
        "fileType": "",
        "language": "",
        "readonly": false,
    });

    export function updateFileInfo(file) {
        file_info.set(file);
    }
    export function getFileInfo() {
        return $file_info;
    }
    export function getFileContent() {
        return content;
    }
    export function getLang(ext) {
        return getLangFromExt(ext);
    }

    onMount(() => {
        editorView = new EditorView({
            parent: ref,
            state: EditorState.create({
                extensions: [
                    lineNumbers(),
                    highlightActiveLineGutter(),
                    highlightSpecialChars(),
                    highlightActiveLine(),
                    dropCursor(),
                    history(),
                    drawSelection(),
                    crosshairCursor(),
                    rectangularSelection(),
                    keymap.of([indentWithTab]),
                    EditorState.allowMultipleSelections.of(true),
                    syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
                    keymap.of([
                        ...defaultKeymap,
                        ...historyKeymap,
                        ...searchKeymap,
                    ])
                ],
                doc: content
            })
        })
        editorView.contentDOM.classList.add("mousetrap");
    });
    async function updateContent() {
        await tick();
        content = editorView.state.doc.toString();
        updateSaveState(false);
    }
    export async function focus() {
        // takes two ticks to focus for some reason
        await tick();
        await tick();
        editorView.focus();
        updateLineInfo();
        language.set($file_info.language);
    }
    function updateLineInfo() {
        let lineNumber = editorView.state.doc.lineAt(editorView.state.selection.main.head).number;
        let columnNumber = editorView.state.selection.ranges[0].head - editorView.state.doc.lineAt(editorView.state.selection.main.head).from;
        line_info.set({line: lineNumber.toString(), column: (columnNumber + 1).toString()})
    }

    async function handleKeyDown(e) {
        let key = e.code;
        switch(key) {
            case "Backspace": case "Enter":
                await updateContent();
                updateLineInfo();
            case "ArrowRight": case "ArrowLeft": case "ArrowDown": case "ArrowUp":
                updateLineInfo();
        }
    }
</script>
<script lang="ts" context="module">
    import { languages as cmLangs } from "@codemirror/language-data";

    export const line_info = writable({line: "-", column: "-"});
    export const language = writable("Unknown");

    export function getLangFromExt(ext: string) {
        if (ext === "txt") {
            return "Plain Text";
        }

        let cmlang = cmLangs.find(l => l.extensions.includes(ext));
        if (cmlang) {
            return cmlang.name;
        }
        else {
            return "Unknown";
        }
    }
</script>

<div bind:this={ref} class="editor" class:hidden on:input={updateContent} on:mousedown={updateLineInfo} on:keydown={handleKeyDown}></div>

<style lang="scss">
    .editor {
        height: 100%;
        width: 100%;
    }
    .hidden {
        display: none;
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
        &::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 20px;
        }
        &::-webkit-scrollbar-corner {
            background-color: transparent;
        }
    }
    :global(.cm-content) {
        padding: 0 0 200px 0 !important;
    }
    :global(.cm-lineNumbers), :global(.cm-gutterElement) {
        min-width: 50px !important;
        text-align: center !important;
    }
</style>