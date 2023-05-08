<script context="module">
    const _expansionState = {
        /* treeNodeId: expanded <boolean> */
    };
</script>

<script lang="ts">
    import FileTreeList from "./FileTreeList.svelte";

    export let tree;
</script>

<ul class="tree" role="tree">
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
    }
</style>
