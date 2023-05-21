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
    import ContextMenu from "../utility/ContextMenu.svelte";

    export let id;
    export let name;
    export let path;

    let selected = false;

    let ref = null;
    let refLabel = null;
    let icon = File;

    let contextmenu = false;
    let contextmenuitems = [
        {name: "Open in File Explorer", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Cut", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy Filename", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy Absolute Path", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Edit", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Rename...", shortcut: "F2", disabled: true, action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Delete", shortcut: "Delete", action: () => {console.warn("Feature not implemented yet.")}}
    ]

    function dragstart(e) {
        let data = {element: `filetree-node-${id}`, id:id, type: "node"};
        e.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    const offset = () => computeTreeLeafDepth(refLabel) + (icon ? 2 : 1);

    const dispatch = createEventDispatcher();
    function handleSelect(node, event) {
        for (let nodes of document.getElementsByClassName("tree-label")) {
            nodes.classList.remove("selected")
        }
        if (event.target === refLabel) {
            event.target.classList.add("selected")
        }
        if (!contextmenu) {
            dispatch("nodeselect", {node});
        }
    }

    $: if (refLabel) {
        refLabel.style.marginLeft = `-${offset()}rem`;
        refLabel.style.paddingLeft = `${offset()}rem`;
    }

    $:treenode = {id, name, path}
</script>

<svelte:window on:click={(e) => {
    if (e.target !== refLabel) {
        refLabel.classList.remove("selected")
    }
}}></svelte:window>

<li id={`filetree-node-${id}`} bind:this={ref} class="treenode" title={path}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div bind:this={refLabel} class="tree-label" class:selected on:click={(e) => {handleSelect(treenode, e)}} draggable={true} on:dragstart={dragstart} on:mouseup={(e) => {
        if (e.button === 2) {
            contextmenu = true;
            handleSelect(treenode, e);
        }
    }}>
        <span class="no-arrow"></span>
        {#if icon}
            <svelte:component this={icon} />
        {/if}
        {name}
    </div>
</li>

{#if contextmenu}
    <ContextMenu target={refLabel} items={contextmenuitems}></ContextMenu>
{/if}

<style lang="scss">
    .treenode {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding-left: 1rem;
    }
    .tree-label {
        display: flex;
        min-height: 1.5rem;
        font-size: 14px;
        align-items: center;
        flex: 1;
        white-space: nowrap;
        :global(svg){
            min-width: 18px;
            min-height: 18px;
            padding: 0 5px 0 0;
        }
    }
    .no-arrow {
        display: flex;
        margin-right: 15px;
    }
</style>