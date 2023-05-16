<script lang="ts">
    import {keymap, highlightSpecialChars, drawSelection, highlightActiveLine, dropCursor,
        rectangularSelection, crosshairCursor,
        lineNumbers, highlightActiveLineGutter, EditorView} from "@codemirror/view"
    import {EditorState } from "@codemirror/state"
    import {defaultHighlightStyle, syntaxHighlighting} from "@codemirror/language"
    import {defaultKeymap, history, historyKeymap, indentWithTab} from "@codemirror/commands"
    import {searchKeymap} from "@codemirror/search"
    import { onMount, tick } from "svelte";

    let ref;
    let editorView;
    export let hidden = false;
    export let content = "";

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
    });
</script>

<div bind:this={ref} class="editor" class:hidden></div>

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
        cursor: text;
        height: 100%;
    }
    :global(.cm-scroller) {
        font-size: 14px !important;
        line-height: 1.3 !important;
        overflow-y: overlay;
        overflow-x: overlay !important;
        padding-top: 7px;
        &::-webkit-scrollbar {
            width: 5px;
            height: 5px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 20px;
        }
        &::-webkit-scrollbar-corner {
            background-color: transparent;
        }
    }
    :global(.cm-content) {
        padding: 0 !important;
    }
    :global(.cm-lineNumbers), :global(.cm-gutterElement) {
        min-width: 50px !important;
        text-align: center !important;
    }
</style>