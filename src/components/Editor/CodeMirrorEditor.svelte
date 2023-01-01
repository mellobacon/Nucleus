<script lang="ts">
    import { onMount, tick } from "svelte";
    import { basicSetup } from "codemirror";
    import { EditorView, keymap } from "@codemirror/view";
    import { indentWithTab } from "@codemirror/commands";
    import { EditorState, Compartment } from "@codemirror/state";
    import { default_theme } from "./scripts/DefaultTheme";
    import { file_language, file_linefeed, line_info } from "./scripts/Editor";
    import settings from "../../config/nucleus-settings.json";
    import { autosave, executeEditorShortcut } from "../../config/config";
    import { saveFile, updateSaveState } from "../../scripts/EditorFile";
    import "./syntaxhighlighting.scss";
    

    const shortcuts = Object.entries(settings.shortcuts);
    let keys = {};

    function modifier(shortcut) {
        switch (shortcut) {
            case "Ctrl":
                return "Control";
            case "Shift":
                return "Shift";
            case "Alt":
                return "Alt";
        }
        return "";
    }

    export let hidden = false;
    let editorElement;
    let editorView: EditorView;
    export let content = "";
    export let lang = new Compartment();
    export let theme = new Compartment();
    let file_info;
    let _ = null;
    
    export function getFileContent() {
        return content;
    }
    export function getFileInfo() {
        return file_info;
    }
    export function setFileInfo(file) {
        let name = file.filename;
        let path = file.path;
        let linefeed = file.linefeed;
        let language = file.language.name;
        setLanguageMode(file.language.mode);
        file_linefeed.set(file.linefeed);
        file_info = {name, path, linefeed, language};
    }

    export async function setLanguage(lang, mode) {
        file_info.language = lang;
        file_language.set(lang);
        setLanguageMode(await mode);
    }

    export function setLanguageMode(mode) {
        editorView.dispatch({
            effects: lang.reconfigure(mode)
        })
    }
    export async function focus() {
        await tick();
        await tick();
        file_linefeed.set(file_info.linefeed);
        file_language.set(file_info.language);
        updateTheme();
        editorView.focus();
        getLineInfo();
    }
    export function updateTheme() {
        editorView.dispatch({
            effects: theme.reconfigure(default_theme)
        })
    }
    function getLineInfo() {
        let linenumber = editorView.state.doc.lineAt(editorView.state.selection.main.head).number;
        let colnumber = editorView.state.selection.ranges[0].head - editorView.state.doc.lineAt(editorView.state.selection.main.head).from
        line_info.set({line: linenumber.toString(), col: (colnumber + 1).toString()});
    }
    export async function updateDom() {
        await tick();
        let filecontent = "";
        for (let text of editorView.state.doc) {
            filecontent += `${text} `;
        }
        content = filecontent;
        // save content to file
        if (!$autosave) {
            updateSaveState();
            return;
        }
        clearTimeout(_);
        _ = setTimeout(() => {
            if (!file_info || !file_info.path) {
                console.log("File path not found, cannot save.");
            }
            else if (file_info.path !== "") {
                saveFile();
                console.log("file saved");
            }
        }, 1000)
    }

    onMount(() => {
        editorView = new EditorView({
            state: EditorState.create({
                extensions: [basicSetup, theme.of([default_theme]), keymap.of([indentWithTab]), lang.of([])],
                doc: content
            }),
            parent: editorElement,
        });
    });
</script>
<div class="editor" class:hidden bind:this={editorElement} 
on:input={async (e) => {
    await updateDom();
    getLineInfo();
}}
on:keyup={(e) => {
    const key = e.key.charAt(0).toUpperCase() + e.key.slice(1);
    keys[key] = false;
    keys = {};
}}
on:keydown={async (e) => {
    const key = e.key.charAt(0).toUpperCase() + e.key.slice(1);
    keys[key] = true;
    for (const [name, shortcutKey] of shortcuts) {
        if (keys[modifier(shortcutKey.modifier)] && keys[modifier(shortcutKey.secondaryKey)] && keys[shortcutKey.primaryKey]) {
            executeEditorShortcut(name);
            return false;
        }
        else if (keys[modifier(shortcutKey.modifier)] && shortcutKey.secondaryKey === "" && keys[shortcutKey.primaryKey]) {
            // janky or something yes yes sue me
            if (name === "paste-shortcut" || name === "cut-shortcut" || name === "redo-shortcut" || name === "undo-shortcut") {
                updateDom();
                getLineInfo();
                return false;
            }
            executeEditorShortcut(name);
            return false;
        }
        else if (shortcutKey.modifier === "" && shortcutKey.secondaryKey === "" && keys[shortcutKey.primaryKey]) {
            e.preventDefault();
            if (name === "delete-shortcut") {
                await updateDom();
                getLineInfo();
                break;
            }
            executeEditorShortcut(name);
            break;
        }
    }
}}
on:keydown={async (e) => {
    let key = e.code;
    switch(key) {
        case "Backspace": case "Enter":
            await updateDom();
            getLineInfo();
            break;
        case "ArrowRight": case "ArrowLeft": case "ArrowDown": case "ArrowUp":
            getLineInfo();
            break;
    }
}}
on:mousedown = {(e) => {
    getLineInfo();
}}
 />

<style>
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
        overflow-y: overlay;
        overflow-x: overlay !important;
    }
    :global(.cm-scroller)::-webkit-scrollbar {
        width: 20px;
    }
    :global(.cm-scroller)::-webkit-scrollbar-thumb {
        background-color: #4c4c4c38;;
    }
    :global(.cm-scroller)::-webkit-scrollbar-corner {
        background-color: transparent;
    }
    :global(.cm-content) {
        padding: 0 !important;
    }
</style>
