<script lang="ts">
    import EditorTabs from "./EditorTabs.svelte";
    import { tabs } from "./Tabs";
</script>

{#if $tabs.length > 0}
    <EditorTabs />
    <div id="editor"></div>
{/if}

<style>
    #editor {
        width: 100%;
        padding-top: 2rem;
        height: calc(100%);
        background-color: #1C1C1C;
        z-index: 1;
    }
</style>