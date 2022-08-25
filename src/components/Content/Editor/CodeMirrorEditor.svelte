<script lang="ts">
    import { createEventDispatcher, onMount, tick } from "svelte";
    import { basicSetup } from "codemirror";
    import { EditorView, keymap } from "@codemirror/view";
    import { indentWithTab } from "@codemirror/commands";
    import { EditorState } from "@codemirror/state";
    import { default_theme } from "./DefaultTheme";

    export let hidden = false;
    let editorElement;
    let editorView: EditorView;
    export let content = "";
    
    let dispatch = createEventDispatcher();

    onMount(() => {
        editorView = new EditorView({
            state: EditorState.create({
                extensions: [basicSetup, default_theme, keymap.of([indentWithTab])],
                doc: content
            }),
            parent: editorElement,
        });
    });
</script>
<div class="editor" class:hidden bind:this={editorElement} on:input={async (e) => {
    await tick();
    let filecontent = "";
    for (let text of editorView.state.doc) {
        filecontent += `${text} `;
    }
    dispatch("input", filecontent);
}} />

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
        overflow-x: hidden;
    }
    :global(.cm-scroller)::-webkit-scrollbar {
        width: 20px;
    }
    :global(.cm-scroller)::-webkit-scrollbar-thumb {
        background-color: #4c4c4c38;;
    }
    :global(.cm-content) {
        padding: 0 !important;
    }
</style>
