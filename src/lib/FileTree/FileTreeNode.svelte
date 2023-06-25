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
    import { moveToTrash, openInExplorer } from "../File";
    import { addEditorTab } from "../EditorTabList.svelte";
    import { clipboard } from "@tauri-apps/api";
    import { openRenameModal } from "../../App.svelte";

    export let id;
    export let name;
    export let path;

    let selected = false;

    let ref = null;
    let refLabel = null;
    let icon = File;

    let contextmenu = false;
    let contextmenuitems = [
        {name: "Open in File Explorer", shortcut: "", action: async () => {await openInExplorer(path)}},
        {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Cut", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy Filename", shortcut: "", action: async () => {await clipboard.writeText(name)}},
        {name: "Copy Absolute Path", shortcut: "", action: async () => {await clipboard.writeText(path)}},
        {name: "Edit", shortcut: "", action: () => {addEditorTab(path, name)}},
        {name: "Rename...", shortcut: "F2", disabled: true, action: () => {openRenameModal(`Rename ${name}`,
        `Give a new name to ${name}`, [
            {name: "Rename", action: () => {}},
            {name: "Cancel", action: () => {}}
        ])}},
        {name: "Delete", shortcut: "Delete", action: async () => {await moveToTrash(path)}}
    ]

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
        if (!contextmenu) {
            dispatch("nodeselect", {node});
        }
    }

    function handleDoubleSelect(node, event) {
        for (let nodes of document.getElementsByClassName("tree-label")) {
            nodes.classList.remove("selected")
        }
        if (event.target === refLabel) {
            event.target.classList.add("selected")
        }
        if (!contextmenu) {
            dispatch("dblnodeselect", {node});
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
    <div bind:this={refLabel} class="tree-label" class:selected 
    on:click={(e) => {handleSelect(treenode, e)}} 
    on:dblclick={(e) => {handleDoubleSelect(treenode, e)}} 
    draggable={true} on:dragstart={dragstart} on:mouseup={(e) => {
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