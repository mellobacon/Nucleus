<script lang="ts">
    import EditorTabs from "./EditorTabs.svelte";
    import { hidden } from "./Tabs";
</script>

<EditorTabs />
<div id="tabview" class:hidden={$hidden}></div>

<style>
    #tabview {
        width: 100%;
        padding-top: 2rem;
        height: calc(100%);
        background-color: #1C1C1C;
        z-index: 1;
    }
    .hidden {
        visibility: hidden;
    }
</style>