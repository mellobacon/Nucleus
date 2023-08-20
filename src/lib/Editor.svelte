<script lang="ts">
    import {keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
        rectangularSelection, crosshairCursor,
        lineNumbers, highlightActiveLineGutter, EditorView} from "@codemirror/view"
    import {EditorState} from "@codemirror/state"
    import {defaultHighlightStyle, syntaxHighlighting} from "@codemirror/language"
    import {defaultKeymap, history, indentWithTab, undo, redo, deleteCharForward, deleteToLineEnd} from "@codemirror/commands";
    import { onMount, tick } from "svelte";
    import { writable } from "svelte/store";
    import { saveFile, updateSaveState } from "./File";
    import { appSettings } from "../config/config";
    import { getCurrentEditor } from "./EditorTabList.svelte";

    let ref;
    let editorView: EditorView;
    export let hidden = false;
    export let content = "";
    const file_info = writable({
        "filename": "",
        "path": "",
        "fileType": "",
        "language": "",
        "encoding": "",
        "hasBom": false,
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
    export function getEncoding() {
        return $file_info.encoding;
    }
    export function hasBom() {
        return $file_info.hasBom;
    }
    export function getView() {
        return editorView;
    }

    onMount(async () => {
        editorView = new EditorView({
            parent: ref,
            state: EditorState.create({
                extensions: [
                    lineNumbers(),
                    highlightActiveLineGutter(),
                    //highlightSpecialChars(), // disabled as an attempt to hide bom for now
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
                        ...defaultKeymap
                    ]),
                    EditorView.updateListener.of(async update => {
                        if (update.docChanged) {
                            await updateContent();
                        }
                        if (update.state.selection.ranges.some(r => !r.empty)) {
                            updateLineInfo();
                        }
                    })
                ],
                doc: content
            })
        })
        editorView.contentDOM.classList.add("mousetrap");
        setEditorFontSize(await appSettings.get("editor.fontSize"));
        setEditorFontFamily(await appSettings.get("editor.fontFamily"));
    });

    let _ = null;
    async function updateContent() {
        await tick();
        content = editorView.state.doc.toString();
        if (await appSettings.get("editor.autosave") === "true") {
            clearTimeout(_);
            _ = setTimeout(async () => {
                if (!$file_info.path || $file_info.path === $file_info.filename || $file_info.path === "") {
                    console.warn("No path found. Cannot save");
                    return;
                }
                else {
                    await saveFile();
                }
            }, 1000)
        }
        else {
            updateSaveState(false);
        }
        updateLineInfo();
    }
    export async function focus() {
        // takes two ticks to focus for some reason
        await tick();
        await tick();
        editorView.focus();
        updateLineInfo();
        language.set($file_info.language);
        encoding.set({value: $file_info.encoding, hasBom: $file_info.hasBom});
    }
    export function updateLineInfo() {
        let lineNumber = editorView.state.doc.lineAt(editorView.state.selection.main.head).number;
        let columnNumber = editorView.state.selection.ranges[0].head - editorView.state.doc.lineAt(editorView.state.selection.main.head).from;
        line_info.set({line: lineNumber.toString(), column: (columnNumber + 1).toString()})
    }

    async function handleKeyDown(e) {
        let key = e.code;
        switch(key) {
            case "ArrowRight": case "ArrowLeft": case "ArrowDown": case "ArrowUp":
                updateLineInfo();
        }
    }
</script>
<script lang="ts" context="module">
    import { languages as cmLangs } from "@codemirror/language-data";

    export const line_info = writable({line: "-", column: "-"});
    export const language = writable("Unknown");
    export const encoding = writable({value: "UTF-8", hasBom: false});

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
    export function setEditorFontSize(value: number) {
        // there could be a better way to do all this but. eh
        const editors = document.querySelectorAll(".cm-scroller");
        for (const editorContainer of editors) {
            (editorContainer as HTMLElement).style.setProperty("font-size", `${value}px`, "important")
        }
    }
    export function setEditorFontFamily(family: string) {
        const editors = document.querySelectorAll(".cm-scroller");
        for (const editorContainer of editors) {
            (editorContainer as HTMLElement).style.setProperty("font-family", family, "important")
        }
    }

    // TODO: need to find a much better way of handling this
    // yes im aware how messy all these functions are but it works!
    export async function append(value: string) {
        let cursorpos = getCurrentEditor().getView().state.selection.main.head + value.length;
        const lines = value.split("\n").length - 1;
        if (lines > 0) {
            cursorpos -= lines;
        }
        getCurrentEditor().getView().dispatch({
            changes: {
                from: getCurrentEditor().getView().state.selection.ranges[0].from,
                to: getCurrentEditor().getView().state.selection.ranges[0].to,
                insert: value,
            },
            selection: {anchor: cursorpos, head: cursorpos},
            scrollIntoView: true
        })
        await getCurrentEditor().updateContent();
        getCurrentEditor().updateLineInfo();
    }
    export async function copy() {
        const selection = getCurrentEditor().getView().state.sliceDoc(getCurrentEditor().getView().state.selection.main.from, getCurrentEditor().getView().state.selection.main.to)
        await navigator.clipboard.writeText(selection);
    }
    export async function cut() {
        deleteToLineEnd(getCurrentEditor().getView())
        await getCurrentEditor().updateContent();
        getCurrentEditor().updateLineInfo();
    }
    export async function undoChange() {
        undo(getCurrentEditor().getView());
        await getCurrentEditor().updateContent();
        getCurrentEditor().updateLineInfo();
    }
    export async function redoChange() {
        redo(getCurrentEditor().getView());
        await getCurrentEditor().updateContent();
        getCurrentEditor().updateLineInfo();
    }
    export async function deleteChars() {
        deleteCharForward(getCurrentEditor().getView());
        await getCurrentEditor().updateContent();
        getCurrentEditor().updateLineInfo();
    }
</script>

<div bind:this={ref} class="editor" class:hidden on:mousedown={updateLineInfo} on:keydown={handleKeyDown}></div>

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