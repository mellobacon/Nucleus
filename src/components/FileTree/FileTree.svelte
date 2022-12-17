<script lang="ts">
    import ArrowUp from "carbon-icons-svelte/lib/ArrowUp.svelte";
    import WatsonHealthRotate_360 from "carbon-icons-svelte/lib/WatsonHealthRotate_360.svelte";
    import TreeView from "./TreeView.svelte";
    import { updateTree } from "./scripts/TreeData";
    import { onMount } from "svelte";
    import { filetree, workspacename } from "./scripts/TreeStore";
    import { data, workspace } from "./scripts/TreeData";
    import { addFileTab } from "../Tabs/scripts/Tab";
    import { InlineLoading } from "carbon-components-svelte";
    import { loadingtree } from "./scripts/TreeData";
    let treeview = null;
    let tree = $filetree;

    async function openTab(event) {
        await addFileTab(event.detail.path);
    }
    onMount(() => {
        tree = $filetree;
        filetree.subscribe(t => tree = t);
        let name = $workspacename;
        workspacename.subscribe(n => name = n);
    });

    async function loadTree() {
        let treedata = await data();
        if (treedata === undefined) {
            loadingtree.set(false);
            return;
        }
        filetree.set(treedata);
        workspacename.set(workspace());
        loadingtree.set(false);
    }
</script>

<div id="explorer-toolbar">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="toolbar-button" on:click={treeview?.collapseAll}>
        <ArrowUp />
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="toolbar-button" on:click={ async() => {if (tree.length > 0) await updateTree();}}>
        <WatsonHealthRotate_360 />
    </div>
</div>

{#if tree.length==0 || $loadingtree}
    <div class="container">
        {#if $loadingtree}
        <InlineLoading description="Loading workspace..."></InlineLoading>
        {:else}
        <div class="text-form">
            You have not yet opened a folder.
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="toolbar-button-mx" on:click ={async() => { 
            await loadTree();
        }
        }>Open Folder</div>
        {/if}
    </div>
{:else}
    <TreeView isFileTree dblclick bind:this={treeview} size="compact" hideLabel children={tree} on:select={openTab}></TreeView>
{/if}


<style>
    #explorer-toolbar {
        height: 1rem;
        width: 100%;
        border-bottom: 1px solid #333;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 0 10px 0;
    }
    .toolbar-button {
        width: 1rem;
        height: 1rem;
        cursor: pointer;
        margin: 0 3px 0 3px;
    }
    .toolbar-button:hover {
        background-color: #333;
    }

    .toolbar-button-mx {
        background-color: #222222;
        color: #fff;
        font-family: inherit;
        text-align: center;
        padding: 7px 30px;
        margin-top: 10px;
        margin-bottom: 5px;
        display: inline-block;
        cursor: pointer;
    }

    .toolbar-button-mx:hover {
        background-color: rgb(50 50 50);
    }

    .text-form {
        margin-top: 10px;
        margin-bottom: 5px;
        text-align: center;
    }
    .container {
        display:flex; 
        flex-direction:column; 
        align-items: center;
        justify-content:center;
        min-height: 10vh;
        margin-top: 10px;
        margin-bottom: 5px;
    }
</style>