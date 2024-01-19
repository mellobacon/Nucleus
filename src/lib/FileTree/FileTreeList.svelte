<script context="module">
    const _expansionState = {
        /* treeNodeId: expanded <boolean> */
    };
</script>

<script lang="ts">

    import FileTreeNode, { computeTreeLeafDepth } from "./FileTreeNode.svelte";
    import Directory from "../../util/icons/Directory.svelte";
    import {filetree} from "../FileTree.svelte";
    import ContextMenu from "../utility/ContextMenu.svelte";
    import { moveFile, moveToTrash } from "../File";
    import { clipboard } from "@tauri-apps/api";
    import { onMount } from "svelte";
    import { commands } from "../../config/commands";

    export let root = false;
    export let isroot = false;

    export let id = "";
    export let name = "";
    export let path = "";
    export let children = [];
    export let contextMenuEnabled;
    export let iconsEnabled;
    export let isExpanded;
    export let canDrag = false;

    let expanded = _expansionState[name] || false;
    let ref = null;
    let refLabel = null;
    let refChildren = null;
    let selected = false;

    let icon = Directory;

    let contextmenu = false;
    let contextmenuitems = [
        {name: "Open in File Explorer", shortcut: commands.openInExplorer.keybind, action: async () => commands.openInExplorer.command(path)},
        {name: "New Folder...", shortcut: "", action: () => commands.createFolder.command(path)},
        {name: "New File...", shortcut: "", action: () => commands.createFile.command(path)},
        {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Cut", disabled: isroot, shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Paste", shortcut: "Ctrl + X", disabled: true, action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy Filename", shortcut: "", action: async () => {await clipboard.writeText(name)}},
        {name: "Copy Absolute Path", shortcut: "", action: async () => {await clipboard.writeText(path)}},
        {name: "Rename...", disabled: isroot, shortcut: commands.renameFile.keybind, action: () => {commands.renameFile.command(name, path)}},
        {name: "Delete", disabled: isroot, shortcut: "Delete", action:  async () => {await moveToTrash(path)}}
    ]

    onMount(() => {
        if (isExpanded) {
            expanded = _expansionState[name] = !expanded;
        }
    })
    function findNode(nodeid, tree = null) {
        if (!tree) {
            tree = $filetree;
            if (nodeid === tree[0].id) {
                return tree[0];
            }
        }
        for (let node of tree) {
            if (nodeid === node.id) {
                return node;
            }
            else if (node.children) {
                let n = findNode(nodeid, node.children);
                if (n) {
                    return n;
                }
                continue;
            }
        }
    }

    function dragstart(e) {
        let data = {element: `filetree-node-${id}`, id:id, type: "directory"};
        e.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    async function drop(e) {
        let data = JSON.parse(e.dataTransfer.getData("text/plain"))
        let el = document.getElementById(data.element);
        let from = el.parentElement;
        let to = dropTarget.parentElement.parentElement;
        if (dropTarget.hasAttribute("data-nodetype")) {
            if (dropTarget.nextElementSibling) {
                to = dropTarget.nextElementSibling;
            }
            else {
                to = dropTarget;
            }
        }
        
        const fromid = from.getAttribute("data-id");
        const toid = to.getAttribute("data-id");
        const element = findNode(parseInt(data.id));
        const fromlist = findNode(parseInt(fromid));
        const tolist = findNode(parseInt(toid));
        
        if (fromlist.path === tolist.path) return;

        await moveFile(fromlist.path, tolist.path, element.path);

        e.target.classList.remove("hover");
    }

    let dropTarget = null;
    function dragenter(e) {
        switch (e.target.nodeName) {
            case "svg": case "SPAN":
                dropTarget = e.target.parentElement;
                break;
            case "path":
                dropTarget = e.target.parentElement.parentElement;
                break;
            default:
                dropTarget = e.target;
        }
        e.target.classList.add("hover");
    }
    function dragleave(e) {
        e.target.classList.remove("hover");
    }

    const toggleExpansion = (event) => {
        for (let nodes of document.getElementsByClassName("tree-label")) {
            nodes.classList.remove("selected")
        }
        if (event.target === refLabel) {
            event.target.classList.add("selected")
        }

        if (!contextmenu) {
            expanded = _expansionState[name] = !expanded;
        }
    };

    function offset () {
        const depth = computeTreeLeafDepth(refLabel);

        if (parent) return depth + 1;
        if (icon) return depth + 2;
        return depth + 2.5;
    };

    $: arrowDown = expanded;
    $: parent = Array.isArray(children);
    $: if (refLabel) {
        refLabel.style.marginLeft = `-${offset()}rem`;
        refLabel.style.paddingLeft = `${offset()}rem`;
    }
</script>

<svelte:window on:click={(e) => {
    if (e.target !== refLabel) {
        contextmenu = false;
    }
}}></svelte:window>

{#if root}
    {#each children as child}
        {#if Array.isArray(child.children)}
            <svelte:self {canDrag} on:nodeselect on:dblnodeselect isroot={root} {...child} {contextMenuEnabled} {iconsEnabled} {isExpanded}></svelte:self>
        {:else}
            <FileTreeNode {canDrag} on:nodeselect on:dblnodeselect {...child} {contextMenuEnabled} {iconsEnabled}/>
        {/if}
    {/each}
{:else}
    <li id={`filetree-node-${id}`} bind:this={ref} class="treenode" class:root={isroot} on:dragenter|stopPropagation={dragenter} on:dragleave|stopPropagation={dragleave} on:dragend|stopPropagation={dragleave} title={path}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div bind:this={refLabel} data-id={id} class:selected class="tree-label" data-nodetype="directory" on:click={toggleExpansion} on:dragover|preventDefault on:drop|stopPropagation={drop} draggable={isroot === false && canDrag} on:dragstart={dragstart} on:mouseup={(e) => {
            if (e.button === 2 && contextMenuEnabled) {
                contextmenu = true;
            }
        }}>
            <span class="arrow" class:arrowDown>&#x25b6</span>
            {#if icon && iconsEnabled}
                <svelte:component this={icon} />
            {/if}
            {name}
        </div>
        {#if expanded}
            <ul role="group" bind:this={refChildren} data-id={id} class="tree-children" on:dragover|preventDefault on:drop|stopPropagation={drop}>
                {#each children as child (child.id) }
                    {#if Array.isArray(child.children)}
                        <svelte:self {canDrag} on:nodeselect on:dblnodeselect {...child} {contextMenuEnabled} {iconsEnabled} {isExpanded}></svelte:self>
                    {:else}
                        <FileTreeNode {canDrag} on:nodeselect on:dblnodeselect {...child} {contextMenuEnabled} {iconsEnabled} />
                    {/if}
                {/each}
            </ul>
        {/if}
    </li>
{/if}

{#if contextmenu}
    <ContextMenu target={refLabel} items={contextmenuitems}></ContextMenu>
{/if}


<style lang="scss">
    .arrow {
        display: flex;
        align-items: center;
        transition: transform 200ms;
        font-size: 12px;
        margin-right: 5px;
    }
    .arrowDown {
        transform: rotate(90deg);
    }
    .treenode {
        display: block;
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
        :global(svg) {
            min-width: 18px;
            min-height: 18px;
            padding: 0 5px 0 0;
        }
    }
    .root > .tree-label {
        font-weight: bold;
    }
</style>