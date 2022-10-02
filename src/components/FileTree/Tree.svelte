<script lang="ts">
    import ArrowUp from "carbon-icons-svelte/lib/ArrowUp.svelte";
    import WatsonHealthRotate_360 from "carbon-icons-svelte/lib/WatsonHealthRotate_360.svelte";
    import TreeView from "./TreeView.svelte";
    import { updateTree } from "../FileTree/TreeData";
    import { onMount } from "svelte";
    import { filetree, workspacename } from "./TreeStore";
    import { data, workspace } from "../FileTree/TreeData";
    let treeview = null;
    let tree = $filetree;
    onMount(() => {
        tree = $filetree;
        filetree.subscribe(t => tree = t);
        let name = $workspacename;
        workspacename.subscribe(n => name = n);
    });
</script>

<div id="explorer-toolbar">
    <div class="toolbar-button" on:click={treeview?.collapseAll}>
        <ArrowUp />
    </div>
    <div class="toolbar-button" on:click={ async() => {await updateTree();}}>
        <WatsonHealthRotate_360 />
    </div>
</div>

{#if tree.length==0}
    <div class="container">
        <div class="text-form">
            You have not yet opened a folder.
        </div>
        <div class="toolbar-button-mx" on:click ={async() => { 
            let treedata = await data();
            if (treedata === undefined) return;
            filetree.set(treedata);
            workspacename.set(workspace());
        }
        }>Open Folder</div>
    </div>
{/if}


<TreeView bind:this={treeview} size="compact" hideLabel children={tree}></TreeView>


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

    .toolbar-button-mx
    {
        background-color: white;
        color: #333;
        font-family: inherit;
        text-align: center;
        padding: 5px 25px;
        margin-top: 10px;
        margin-bottom: 5px;
        display: inline-block;
        cursor: pointer;
    }

    .toolbar-button-mx:hover
    {
        background-color: rgb(177, 177, 177);
    }

    .text-form {
        margin-top: 10px;
        margin-bottom: 5px;
    }
    .container
    {
        display:flex; 
        flex-direction:column; 
        align-items: center;
        justify-content:center;
        min-height:10vh;
        margin-top: 10px;
        margin-bottom: 5px;
    }
</style>