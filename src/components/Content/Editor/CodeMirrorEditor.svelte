<script lang="ts">
    import { onMount } from "svelte";
    import { basicSetup } from "codemirror";
    import { EditorView, keymap } from "@codemirror/view";
    import { indentWithTab } from "@codemirror/commands";
    import { EditorState } from "@codemirror/state";
    import { default_theme } from "./DefaultTheme";

    export let hidden = false;
    let editorElement;
    let editorView;

    onMount(() => {
        editorView = new EditorView({
            state: EditorState.create({
                extensions: [basicSetup, default_theme, keymap.of([indentWithTab])],
            }),
            parent: editorElement,
        });
    });
</script>
<div class="editor" class:hidden bind:this={editorElement} />

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
        overflow: auto;
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
