<script lang="ts">
    import FileTreeView from "./FileTree/FileTreeView.svelte";
    import ContextMenu from "./utility/ContextMenu.svelte";
    import { addEditorTab } from "./EditorTabList.svelte";
    import { openFolder, openInExplorer, createFile, createFolder } from "./File";
    import { clipboard, path as p } from "@tauri-apps/api";
    import { openInputModal } from "../App.svelte";

    let treeDom;
    let contextmenu = false;

    let path = null;
    let name = null;

    function handleClick(e) {
        treeDom = e.detail.target;
        path = $filetree[0].path;
        name = $filetree[0].name;
        contextmenu = e.detail.contextmenu;
    }
    function handleSelect(e) {
        //console.log(e.detail.node)
    }
    function handleDblSelect(e) {
        addEditorTab(e.detail.node.path, e.detail.node.name);
    }

    let contextmenuitems = [
        {name: "Open in File Explorer", shortcut: "", action: async () => {await openInExplorer(path)}},
        {name: "New Folder...", shortcut: "", action: () => {openInputModal("Create New Folder", 
        `Create a new folder in ${path}`, [
            {name: "Create Folder", action: async (name) => { await createFolder(`${path}${p.sep}${name}`)}},
            {name: "Cancel", cancel: true, action: () => {}}
        ], {label: "Folder Name"}, path)}},
        {name: "New File...", shortcut: "", action: () => {openInputModal("Create New File", 
        `Create a new file in ${path}`, [
            {name: "Create File", action: (name) => {createFile(`${path}${p.sep}${name}`)}},
            {name: "Cancel", cancel: true, action: () => {}}
        ], {label: "File Name"}, path)}},
        {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Cut", disabled: true, shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Paste", shortcut: "Ctrl + X", disabled: true, action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Copy Filename", shortcut: "", action: async () => {await clipboard.writeText(name)}},
        {name: "Copy Absolute Path", shortcut: "", action: async () => {await clipboard.writeText(path)}},
        {name: "Rename...", shortcut: "F2", disabled: true, action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Delete", disabled: true, shortcut: "Delete", action: () => {console.warn("Feature not implemented yet.")}}
    ]
</script>

<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export let filetree = writable([]);
</script>

{#if $filetree.length === 0}
    <div class="container">
        <span>No folder/workspace open</span>
        <button class="toolbar-button" on:click={async () => {await openFolder()}}>Open Folder</button>
    </div>
{:else}
    <FileTreeView tree={$filetree} on:nodeselect={handleSelect} on:dblnodeselect={handleDblSelect} on:rightclick={handleClick} contextMenuEnabled></FileTreeView>
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