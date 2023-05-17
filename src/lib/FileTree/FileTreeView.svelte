<script context="module">
    const _expansionState = {
        /* treeNodeId: expanded <boolean> */
    };
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import FileTreeList from "./FileTreeList.svelte";
    
    export let tree;

    let ref;
    let dispatch = createEventDispatcher();

    let contextmenu = false;
    function handleMouseUp(e) {
        let x = null;
        if (e.button === 2) {
            if (e.target === ref) {
                x = ref;
                contextmenu = true;
            }
            else {
                x = null;
                contextmenu = false;
            }
            dispatch("rightclick", {target: x, contextmenu: contextmenu});
        }
    }
</script>

<ul bind:this={ref} class="tree" role="tree" on:mouseup={handleMouseUp}>
    <FileTreeList on:nodeselect children={tree} root />
</ul>

<style>
    ul {
        margin: 0;
        list-style: none;
        user-select: none;
    }
    .tree {
        width: 100%;
        padding: 10px 0;
        height: -webkit-fill-available;
    }
</style>
