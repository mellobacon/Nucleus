<script context="module">
    const _expansionState = {
        /* treeNodeId: expanded <boolean> */
    };
</script>

<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import FileTreeList from "./FileTreeList.svelte";
    
    export let tree;
    export let contextMenuEnabled = false;
    export let isExpanded = false;
    export let iconsEnabled = false;
    export let canDrag = false;

    let ref;
    let dispatch = createEventDispatcher();

    function handleMouseUp(e) {
        if (e.button === 2 && contextMenuEnabled) {
            if (e.target === ref) {
                dispatch("rightclick", {target: ref, contextmenu: true});
            }
            else {
                dispatch("rightclick", {target: null, contextmenu: false});
            }
        }
    }
</script>

<ul bind:this={ref} class="tree" role="tree" on:mouseup|stopPropagation={handleMouseUp}>
    <FileTreeList {canDrag} {isExpanded} on:nodeselect on:dblnodeselect children={tree} root {contextMenuEnabled} {iconsEnabled} />
</ul>

<style>
    ul {
        margin: 0;
        list-style: none;
        user-select: none;
    }
    .tree {
        width: 100%;
        padding: 0 0 10px 0;
        font-size: 14px;
    }
</style>
