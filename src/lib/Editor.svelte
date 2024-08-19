<script lang="ts">
    import {keymap, drawSelection, highlightActiveLine, dropCursor,
        rectangularSelection, crosshairCursor,
        lineNumbers, highlightActiveLineGutter, EditorView} from "@codemirror/view";
    import {EditorState, Compartment} from "@codemirror/state"
    import {defaultKeymap, history, indentWithTab } from "@codemirror/commands";
    import { onMount, tick } from "svelte";
    import { writable } from "svelte/store";
    import { saveFile, updateSaveState } from "./File";
    import { appSettings } from "../config/config";
    import { warn } from "tauri-plugin-log-api";
    import { foldGutter, bracketMatching, indentUnit, syntaxHighlighting } from "@codemirror/language";
    import { closeBrackets } from "@codemirror/autocomplete";
    import { indentationMarkers } from '@replit/codemirror-indentation-markers';
    import { editorHighlightStyle, editorTheme, getThemeProperty, is_dark_theme } from "../config/themehandler";
    import { autocompletion } from "@codemirror/autocomplete";



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
        "spaces": 0,
        "readonly": false,
    });
    const lang = new Compartment();
    const tabSize = new Compartment();
    const indentSize = new Compartment();
    const colorScheme = new Compartment();
    const theme = new Compartment();
    const fontFamily = new Compartment();
    const fontSize = new Compartment();

    export function updateFileInfo(file) {
        file_info.set(file);
    }
    export function getFileInfo() {
        return $file_info;
    }
    export function getFileContent() {
        return content;
    }
    export async function getLang(ext) {
        if (ext === "txt") {
            return "Plain Text";
        }
        let language = getLangFromExt(ext);
        if (language) {
            const mode = await language.load();
            if (!mode) {
                warn(`Syntax highlighting not supported for ${language.name}.`, {file: "Editor.svelte", line: 46});
            }
            else {
                setLangMode(mode);
            }
            return language.name;
        }
        warn(`Language not found or extension "${ext}" not supported.`, {file: "Editor.svelte", line: 53});
        return "Unknown";
    }
    function setLangMode(mode) {
        editorView.dispatch({
            effects: lang.reconfigure(mode)
        })
    }
    export function getEncoding() {
        return $file_info.encoding;
    }
    export function hasBom() {
        return $file_info.hasBom;
    }
    export function getSpaces() {
        return $file_info.spaces;
    }
    export function getView() {
        return editorView;
    }
    export function setTabSize(size) {
        spaces.set(size);
        editorView.dispatch({
            effects: tabSize.reconfigure(EditorState.tabSize.of(size))
        })
        setIndentSize(size)
    }
    function setIndentSize(size) {
        editorView.dispatch({
            effects: indentSize.reconfigure(indentUnit.of(" ".repeat(size)))
        })
    }
    export function setScheme(scheme) {
        editorView.dispatch({
            effects: colorScheme.reconfigure(EditorView.darkTheme.of(scheme))
        })
    }
    export function setTheme() {
        editorView.dispatch({
            effects: theme.reconfigure([get(editorTheme), syntaxHighlighting(get(editorHighlightStyle))])
        })
    }
    export function setFontFamily(family: string) {
        editorView.dispatch({
            effects: fontFamily.reconfigure(EditorView.theme(
            {
                "*": { fontFamily: family }
            }))
        })
    }
    export function setFontSize(size: number) {
        editorView.dispatch({
            effects: fontSize.reconfigure(EditorView.theme(
            {
                "*": { fontSize: `${size}px` }
            }))
        })
    }

    onMount(async () => {
        editorView = new EditorView({
            parent: ref,
            state: EditorState.create({
                extensions: [
                    lineNumbers(),
                    foldGutter({openText:"▼", closedText: "►"}),
                    bracketMatching(),
                    closeBrackets(),
                    highlightActiveLineGutter(),
                    //highlightSpecialChars(), // disabled as an attempt to hide bom for now
                    highlightActiveLine(),
                    dropCursor(),
                    history(),
                    drawSelection(),
                    crosshairCursor(),
                    rectangularSelection(),
                    autocompletion({
                        aboveCursor: true,
                        closeOnBlur: false
                    }),
                    indentSize.of(indentUnit.of("    ")),
                    indentationMarkers({
                        thickness: 1,
                        colors: {
                            dark: getThemeProperty("editor-gutterForeground"),
                            activeDark: getThemeProperty("editor-activeIndentLineColor"),
                            light: getThemeProperty("editor-gutterForeground"),
                            activeLight: getThemeProperty("editor-activeIndentLineColor")
                        }
                    }),
                    keymap.of([indentWithTab]),
                    lang.of([]),
                    EditorState.allowMultipleSelections.of(true),
                    theme.of([]),
                    fontFamily.of([]),
                    fontSize.of([]),
                    colorScheme.of(EditorView.darkTheme.of($is_dark_theme)),
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
                    }),
                    tabSize.of(EditorState.tabSize.of(4))
                ],
                doc: content
            })
        })
        editorView.contentDOM.classList.add("mousetrap");
        setTheme();
        setFontSize(await appSettings.get("editor.fontSize"));
        setFontFamily(await appSettings.get("editor.fontFamily"));
        setEditorLineHeight(await appSettings.get("editor.lineHeight"));
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
        setTabSize($file_info.spaces);
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
    import { tabs } from "./EditorTabList.svelte";
    import { get } from "svelte/store";

    export const line_info = writable({line: "-", column: "-"});
    export const language = writable("Unknown");
    export const encoding = writable({value: "UTF-8", hasBom: false});
    export const spaces = writable(4);
    const langmode = writable(null);

    export function getLangFromExt(ext: string) {
        let cmlang = cmLangs.find(l => l.extensions.includes(ext));
        return cmlang;
    }
    export function setEditorFontSize(value: number) {
        for (const tab of get(tabs)) {
            if (tab.isfile) {
                tab.content.setFontSize(value);
            }
        }
    }
    export function setEditorFontFamily(family: string) {
        for (const tab of get(tabs)) {
            if (tab.isfile) {
                tab.content.setFontFamily(family);
            }
        }
    }
    export function setEditorLineHeight(height: string) {
        const editors = document.querySelectorAll(".cm-scroller");
        for (const editorContainer of editors) {
            (editorContainer as HTMLElement).style.setProperty("line-height", height, "important")
        }
    }
    export function setEditorTabSize(size) {
        for (const tab of get(tabs)) {
            if (tab.isfile) {
                tab.content.setTabSize(size);
            }
        }
    }
    export function setColorScheme() {
        for (const tab of get(tabs)) {
            if (tab.isfile) {
                tab.content.setScheme(get(is_dark_theme))
            }
        }
    }
    export function setEditorTheme() {
        for (const tab of get(tabs)) {
            if (tab.isfile) {
                tab.content.setTheme();
            }
        }
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
        width: -webkit-fill-available;
        height: -webkit-fill-available !important;
        position: absolute !important;
    }
    :global(.cm-gutters) {
        z-index: 2;
    }
    :global(.cm-content) {
        padding: 0 10px 200px 0 !important;
        text-wrap: wrap !important;
    }
    :global(.cm-lineNumbers) {
        min-width: 60px !important;
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
</style>
