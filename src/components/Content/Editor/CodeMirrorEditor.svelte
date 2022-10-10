<script lang="ts">
    import { createEventDispatcher, onMount, tick } from "svelte";
    import { basicSetup } from "codemirror";
    import { EditorView, keymap } from "@codemirror/view";
    import { indentWithTab } from "@codemirror/commands";
    import { EditorState, Compartment } from "@codemirror/state";
    import { default_theme } from "./scripts/DefaultTheme";
    import { line_info } from "./scripts/Editor";

    export let hidden = false;
    let editorElement;
    let editorView: EditorView;
    export let content = "";
    export let lang = new Compartment();
    
    export function setLanguageMode(mode) {
        editorView.dispatch({
            effects: lang.reconfigure(mode)
        })
    }
    export async function focus() {
        await tick();
        await tick();
        editorView.focus();
        getLineInfo();
    }
    function getLineInfo() {
        let linenumber = editorView.state.doc.lineAt(editorView.state.selection.main.head).number;
        let colnumber = editorView.state.selection.ranges[0].head - editorView.state.doc.lineAt(editorView.state.selection.main.head).from
        line_info.set({line: linenumber.toString(), col: (colnumber + 1).toString()})
    }
    async function updateDom() {
        await tick();
        let filecontent = "";
        for (let text of editorView.state.doc) {
            filecontent += `${text} `;
        }
        dispatch("input", filecontent);
    }
    let dispatch = createEventDispatcher();

    onMount(() => {
        editorView = new EditorView({
            state: EditorState.create({
                extensions: [basicSetup, default_theme, keymap.of([indentWithTab]), lang.of([])],
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
