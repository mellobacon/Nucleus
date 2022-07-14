<script lang="ts">
    import EditorTabs from "./EditorTabs.svelte";
</script>

<EditorTabs />
<div id="editor"></div>

<style>
    #editor {
        width: 100%;
        height: calc(100% - 1.5rem);
        background-color: #1C1C1C;
        z-index: 1;
    }
</style>