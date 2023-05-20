<script lang="ts">
    import FileTreeView from "./FileTree/FileTreeView.svelte";
    import ContextMenu from "./utility/ContextMenu.svelte";
    let treeDom;
    let contextmenu = false;

    function handleClick(e) {
        treeDom = e.detail.target;
        console.log($filetree[0]);
        contextmenu = e.detail.contextmenu;
    }
    function handleSelect(e) {
        console.log(e.detail.node);
    }

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
</script>

<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export let filetree = writable([]);
</script>

{#if $filetree.length === 0}
    <div class="container">
        <span>No folder/workspace open</span>
        <button class="toolbar-button" on:click={() => {console.warn("Feature not implemented yet.")}}>Open Folder</button>
    </div>
{:else}
    <FileTreeView tree={$filetree} on:nodeselect={handleSelect} on:rightclick={handleClick}></FileTreeView>
{/if}

{#if treeDom && contextmenu}
    <ContextMenu target={treeDom} items={contextmenuitems}></ContextMenu>
{/if}


<style lang="scss">
    .toolbar-button {
        background-color: #222222;
        color: #fff;
        font-family: inherit;
        text-align: center;
        padding: 7px 30px;
        margin-top: 10px;
        margin-bottom: 5px;
        display: inline-block;
        cursor: pointer;
        padding: 5px 25px;
        font-size: 0.875rem;
        border-radius: 2px;
    }
    .toolbar-button:hover {
        background-color: rgb(50 50 50);
    }
    .container {
        display:flex; 
        flex-direction:column; 
        align-items: center;
        justify-content:center;
        min-height: 70vh;
        margin-top: 10px;
        margin-bottom: 5px;
        &>span {
            margin-top: 10px;
            margin-bottom: 5px;
            text-align: center;
            font-size: 0.875rem;
        }
    }
</style>