<script lang="ts" context="module">
    export function computeTreeLeafDepth(node) {
        let depth = 0;

        if (node == null) return depth;

        let parentNode = node.parentNode;

        while (parentNode != null && parentNode.getAttribute("role") !== "tree") {
            parentNode = parentNode.parentNode;
            if (parentNode.tagName === "LI") depth++;
        }

        return depth;
    }
</script>
<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import File from "../../util/icons/File.svelte";


    export let id;
    export let label;
    export let path;

    let selected = false;

    let ref = null;
    let refLabel = null;
    let icon = File;

    const offset = () => computeTreeLeafDepth(refLabel) + (icon ? 2 : 1);

    const dispatch = createEventDispatcher();
    function handleSelect(node, event) {
        for (let nodes of document.getElementsByClassName("tree-label")) {
            nodes.classList.remove("selected")
        }
        if (event.target === refLabel) {
            event.target.classList.add("selected")
        }
        dispatch("nodeselect", {node});
    }

    $: if (refLabel) {
        refLabel.style.marginLeft = `-${offset()}rem`;
        refLabel.style.paddingLeft = `${offset()}rem`;
    }

    $:treenode = {id, label, path}
</script>

<svelte:window on:click={(e) => {
    if (e.target !== refLabel) {
        refLabel.classList.remove("selected")
    }
}}></svelte:window>

<li id={id} bind:this={ref} class="treenode">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div bind:this={refLabel} class="tree-label" class:selected on:click={(e) => {handleSelect(treenode, e)}}>
        {#if icon}
            <svelte:component this={icon} />
        {/if}
        {label}
    </div>
</li>

<style lang="scss">
    .treenode {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding-left: 1rem;
    }
    .tree-label:hover {
        color: white;
        background-color: #353535;
    }
    .tree-label {
        display: flex;
        min-height: 1.5rem;
        align-items: center;
        flex: 1;
        white-space: nowrap;
        :global(svg){
            width: 20px;
            height: 20px;
            color: white;
            padding: 0 5px 0 0;
        }
    }
    .selected {
        color: #34b0f8;
    }
</style>