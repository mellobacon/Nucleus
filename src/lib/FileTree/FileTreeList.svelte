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

    export let root = false;
    export let isroot = false;

    export let id = "";
    export let name = "";
    export let path = "";
    export let children = [];

    let expanded = _expansionState[name] || false;
    let ref = null;
    let refLabel = null;
    let refChildren = null;
    let selected = false;

    let icon = Directory;

    let contextmenu = false;
    let contextmenuitems = [
        {name: "Open in File Explorer", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Cut", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Paste", shortcut: "Ctrl + X", disabled: true, action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy Filename", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy Absolute Path", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Rename...", shortcut: "F2", disabled: true, action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Delete", shortcut: "Delete", action: () => {console.warn("Feature not implemented yet.")}}
    ]

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
        let data = {element: `filetree-node-${id}`, id:id, type: "parent"};
        e.dataTransfer.setData("text/plain", JSON.stringify(data));
    }

    function drop(e) {
        let data = JSON.parse(e.dataTransfer.getData("text/plain"))
        let el = document.getElementById(data.element);
        let from = el.parentElement;
        let to = e.target.parentElement.parentElement;

        let fromid = from.getAttribute("data-id");
        let toid = to.getAttribute("data-id");

        const element = findNode(parseInt(data.id));
        const fromlist = findNode(parseInt(fromid));
        const tolist = findNode(parseInt(toid));

        fromlist.children.splice(fromlist.children.indexOf(element), 1);
        tolist.children = [...tolist.children, element];

        from.removeChild(el);
        to.appendChild(el);

        filetree.set($filetree);

        e.target.parentElement.classList.remove("hover");
    }

    function dragenter(e) {
        e.target.parentElement.classList.add("hover");
    }
    function dragleave(e) {
        e.target.parentElement.classList.remove("hover");
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

{#if root}
    {#each children as child}
        {#if Array.isArray(child.children)}
            <svelte:self on:nodeselect on:dblnodeselect isroot={root} {...child}></svelte:self>
        {:else}
            <FileTreeNode on:nodeselect on:dblnodeselect {...child} />
        {/if}
    {/each}
{:else}
    <li id={`filetree-node-${id}`} bind:this={ref} class="treenode" class:root={isroot} on:dragenter|stopPropagation={dragenter} on:dragleave|stopPropagation={dragleave} on:dragend|stopPropagation={dragleave} title={path}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div bind:this={refLabel} class:selected class="tree-label" on:click={toggleExpansion} draggable={true} on:dragstart={dragstart} on:mouseup={(e) => {
            if (e.button === 2) {
                contextmenu = true;
            }
        }}>
            <span class="arrow" class:arrowDown>&#x25b6</span>
            {#if icon}
                <svelte:component this={icon} />
            {/if}
            {name}
        </div>
        {#if expanded}
            <ul role="group" bind:this={refChildren} data-id={id} class="tree-children" on:dragover|preventDefault on:drop|stopPropagation={drop}>
                {#each children as child (child.id) }
                    {#if Array.isArray(child.children)}
                        <svelte:self on:nodeselect on:dblnodeselect {...child}></svelte:self>
                    {:else}
                        <FileTreeNode on:nodeselect on:dblnodeselect {...child} />
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