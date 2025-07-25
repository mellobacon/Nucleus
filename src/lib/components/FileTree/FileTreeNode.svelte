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
    import File from "../../../assets/icons/file.svelte";
    import { contextMenu } from "../../../App.svelte";

    export let id;
    export let name;
    export let path;
    export let contextMenuEnabled;
    export let iconsEnabled;
    export let canDrag = false;

    let selected = false;

    let ref = null;
    let refLabel = null;
    let icon = File;

    function dragstart(e) {
        let data = {element: `filetree-node-${id}`, id:id, type: "file"};
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
    }

    function handleDoubleSelect(node, event) {
        for (let nodes of document.getElementsByClassName("tree-label")) {
            nodes.classList.remove("selected")
        }
        if (event.target === refLabel) {
            event.target.classList.add("selected")
        }
        dispatch("dblnodeselect", {node});
    }

    function handleRightClick(e) {
        if (e.button === 2 && contextMenuEnabled) {
            contextMenu.set({open: true, target: refLabel, items: [
                {name: "filenode", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Open in File Explorer", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Cut", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Copy Filename", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Edit", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Rename...", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Delete", shortcut: "Delete", action: () => {console.warn("Feature not implemented yet.")}}
            ]});
            handleSelect(treenode, e);
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
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div bind:this={refLabel} class="tree-label" class:selected 
    on:click={(e) => {handleSelect(treenode, e)}} 
    on:dblclick={(e) => {handleDoubleSelect(treenode, e)}} 
    draggable={canDrag} 
    on:dragstart={dragstart} 
    on:mouseup|stopPropagation={handleRightClick}>
        <span class="no-arrow"></span>
        {#if icon && iconsEnabled}
            <svelte:component this={icon} />
        {/if}
        {name}
    </div>
</li>

<style lang="scss">
    .treenode {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding-left: 1rem;
    }
    .tree-label {
        display: flex;
        min-height: 1.7rem;
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
        margin-right: 25px;
    }
</style>
