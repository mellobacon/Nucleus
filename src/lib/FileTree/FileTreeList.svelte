<script context="module">
    const _expansionState = {
        /* treeNodeId: expanded <boolean> */
    };
</script>

<script lang="ts">

    import FileTreeNode, { computeTreeLeafDepth } from "./FileTreeNode.svelte";
    import Directory from "../../util/icons/Directory.svelte";
    import {filetree} from "../FileTree.svelte";

    export let root = false;
    export let isroot = false;

    export let id = "";
    export let label = "";
    export let path = "";
    export let children = [];

    let expanded = _expansionState[label] || false;
    let ref = null;
    let refLabel = null;
    let refChildren = null;
    let selected = false;

    let icon = Directory;

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

        expanded = _expansionState[label] = !expanded;
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
            <svelte:self on:nodeselect isroot={root} {...child}></svelte:self>
        {:else}
            <FileTreeNode on:nodeselect {...child} />
        {/if}
    {/each}
{:else}
    <li id={`filetree-node-${id}`} bind:this={ref} class="treenode" class:root={isroot} on:dragenter|stopPropagation={dragenter} on:dragleave|stopPropagation={dragleave} on:dragend|stopPropagation={dragleave}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div bind:this={refLabel} class:selected class="tree-label" on:click={toggleExpansion} draggable={true} on:dragstart={dragstart}>
            <span class="arrow" class:arrowDown>&#x25b6</span>
            {#if icon}
                <svelte:component this={icon} />
            {/if}
            <div class="item-label">{label}</div>
        </div>
        {#if expanded}
            <ul role="group" bind:this={refChildren} data-id={id} class="tree-children" on:dragover|preventDefault on:drop|stopPropagation={drop}>
                {#each children as child (child.id) }
                    {#if Array.isArray(child.children)}
                        <svelte:self on:nodeselect {...child}></svelte:self>
                    {:else}
                        <FileTreeNode on:nodeselect {...child} />
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
    .tree-label:hover {
        color: white;
        background-color: #353535;
    }
    .tree-label {
        display: flex;
        min-height: 1.6rem;
        align-items: center;
        white-space: nowrap;
        :global(svg) {
            width: 20px;
            height: 20px;
            color: white;
            padding: 0 5px 0 0;
        }
    }
    .root > .tree-label .item-label {
        font-weight: bold;
    }
    .selected {
        color: #34b0f8;
    }
</style>