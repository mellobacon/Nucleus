<script context="module">
    import { get, writable } from "svelte/store";

    const _expansionState = {
        /* treeNodeId: expanded <boolean> */
    };
    export let treeNodes = writable(_expansionState);

    export function collapseAll() {
        for (const node of Object.entries(get(treeNodes))) {
            _expansionState[node[0]] = false;
            treeNodes.set(_expansionState);
        }
    }
</script>

<script lang="ts">
    import Folder from "../../../assets/icons/folder.svelte";

    import FolderOpen from "../../../assets/icons/folder_open.svelte";
    import FileTreeNode, { computeTreeLeafDepth } from "./FileTreeNode.svelte";
    import { onMount } from "svelte";
    import { contextMenu } from "../../../App.svelte";
    import ChevronRight from "../../../assets/icons/chevron_right.svelte";

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

    $: expanded = $treeNodes[name] || false;
    let ref = null;
    let refLabel = null;
    let refChildren = null;
    let selected = false;

    let icon = Folder;
    onMount(() => {
        if (isExpanded) {
            expanded = _expansionState[name] = !expanded;
        }
        treeNodes.set(_expansionState);
    })
    const toggleExpansion = (event) => {
        for (let nodes of document.getElementsByClassName("tree-label")) {
            nodes.classList.remove("selected")
        }
        if (event.target === refLabel) {
            event.target.classList.add("selected")
        }

        _expansionState[name] = !expanded;
        expanded = $treeNodes[name]
        //expanded = _expansionState[name] = !expanded;
        treeNodes.set(_expansionState);
    };

    function offset () {
        const depth = computeTreeLeafDepth(refLabel);

        if (parent) return depth + 1;
        if (icon) return depth + 2;
        return depth + 2.5;
    };

    function handleRightClick(e) {
        if (e.button === 2 && contextMenuEnabled) {
            contextMenu.set({open: true, target: refLabel, items: [
                {name: "filelist", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Open in File Explorer", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "New Folder...", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "New File...", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Cut", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Paste", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Copy Filename", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Rename...", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Delete", shortcut: "Delete", action: () => {console.warn("Feature not implemented yet.")}}
            ]})
        }
    }

    $: arrowDown = expanded;
    $: parent = Array.isArray(children);
    $: if (refLabel) {
        refLabel.style.marginLeft = `-${offset()}rem`;
        refLabel.style.paddingLeft = `${offset()}rem`;
    }
</script>

<svelte:window on:click={(e) => {
    if (e.target !== refLabel && refLabel) {
        refLabel.classList.remove("selected")
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
    <li id={`filetree-node-${id}`} bind:this={ref} class="treenode" class:root={isroot} title={path}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div bind:this={refLabel} data-id={id} class:selected class="tree-label" data-nodetype="directory" on:click={toggleExpansion} on:mouseup|stopPropagation={handleRightClick} on:dragover|preventDefault draggable={isroot === false && canDrag}>
            <span class="arrow" class:arrowDown>
                <ChevronRight></ChevronRight>
            </span>
            {#if icon && iconsEnabled && !isroot}
                {#if expanded}
                    <svelte:component this={FolderOpen}></svelte:component>
                {:else}
                    <svelte:component this={icon} />
                {/if}
            {/if}
            {name}
        </div>
        {#if expanded}
            <ul role="group" bind:this={refChildren} data-id={id} class="tree-children" on:dragover|preventDefault>
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


<style lang="scss">
    .arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
        :global(svg) {
            transition: transform 200ms;
            height: 20px;
            width: 20px;
            padding: 0 !important;
        }
    }
    .arrowDown {
        :global(svg) {
            transform: rotate(90deg);
        }
    }
    .treenode {
        display: block;
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
