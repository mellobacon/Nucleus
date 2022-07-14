<script lang="ts">
    import ArrowUp from "carbon-icons-svelte/lib/ArrowUp.svelte";
    import ArrowDown from "carbon-icons-svelte/lib/ArrowDown.svelte";
    import WatsonHealthRotate_360 from "carbon-icons-svelte/lib/WatsonHealthRotate_360.svelte";
    import { TreeView } from "carbon-components-svelte";
    import { getFileData } from "./TreeData";
    import { onMount } from "svelte";
    import { filetree, workspacename } from "./TreeStore";
    let treeview = null;
    let tree = $filetree;
    
    onMount(() => {
        tree = $filetree;
        filetree.subscribe(t => tree = t);
        let name = $workspacename;
        workspacename.subscribe(n => name = n);
    });
</script>

<div id="explorer-toolbar">
    <div class="toolbar-button" on:click={treeview?.collapseAll}>
        <ArrowUp />
    </div>
    <div class="toolbar-button" on:click={treeview?.expandAll}>
        <ArrowDown />
    </div>
    <div class="toolbar-button" on:click={() => {filetree.update(t => $filetree)}}>
        <WatsonHealthRotate_360 />
    </div>
</div>
<TreeView bind:this={treeview} size="compact" hideLabel children={tree} on:select={({ detail }) => {
    if (detail.leaf) {
        getFileData(detail.id)
    }
}}></TreeView>

<style>
    #explorer-toolbar {
        height: 1rem;
        width: 100%;
        border-bottom: 1px solid #333;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0 10px 0;
    }
    .toolbar-button {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        margin: 0 3px 0 3px;
    }
    .toolbar-button:hover {
        background-color: #333;
    }
</style>