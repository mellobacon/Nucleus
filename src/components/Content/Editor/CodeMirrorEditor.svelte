<script lang="ts">
    import { createEventDispatcher, onMount, tick } from "svelte";
    import { basicSetup } from "codemirror";
    import { EditorView, keymap } from "@codemirror/view";
    import { indentWithTab } from "@codemirror/commands";
    import { EditorState } from "@codemirror/state";
    import { default_theme } from "./DefaultTheme";

    import { javascript } from "@codemirror/lang-javascript";
    import { rust } from "@codemirror/lang-rust";
    import { css } from "@codemirror/lang-css";
    import { html } from "@codemirror/lang-html";

    let editorElement;
    let extensions = [basicSetup, default_theme, keymap.of([indentWithTab])]
    let editorView: EditorView;
    let dispatch = createEventDispatcher();

    export let hidden = false;
    export let content = "";
    export let filename = "";

    onMount(() => {
        const filenameExtension = filename.split(".")[1]
        switch (filenameExtension) {
            case "js":
                extensions.push(javascript())
                break;
            case "rs":
                extensions.push(rust())
                break;
            case "css":
                extensions.push(css())
                break;
            case "html":
                extensions.push(html())
                break;
            default:
                break;
        }

        editorView = new EditorView({
            state: EditorState.create({
                extensions,
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
