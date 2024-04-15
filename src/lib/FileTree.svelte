<script lang="ts">
    import FileTreeView from "./FileTree/FileTreeView.svelte";
    import ContextMenu from "./utility/ContextMenu.svelte";
    import { addEditorTab } from "./EditorTabList.svelte";
    import { openFolder, pasteFile } from "./File";
    import { clipboard } from "@tauri-apps/api";
    import Button from "./utility/Button.svelte";
    import { commands } from "../config/commands";

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
        {name: "Open in File Explorer", shortcut: "", action: async () => commands.openInExplorer.command(path)},
        {name: "New Folder...", shortcut: "", action: () => commands.createFolder.command(path)},
        {name: "New File...", shortcut: "", action: () => {commands.createFile.command(path)}},
        {name: "Copy", shortcut: "Ctrl + C", action: async () => {await clipboard.writeText(path)}},
        {name: "Cut", disabled: true, shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
        {name: "Paste", shortcut: "Ctrl + V", action: async () => {await pasteFile(path)}},
        {name: "Copy Filename", shortcut: "", action: async () => {await clipboard.writeText(name)}},
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
        <Button _class="toolbar-button" style="secondary" label="Open Folder" on:click={async () => {await openFolder()}} />
    </div>
{:else}
    <FileTreeView tree={$filetree} on:nodeselect={handleSelect} on:dblnodeselect={handleDblSelect} on:rightclick={handleClick} contextMenuEnabled canDrag></FileTreeView>
{/if}

{#if treeDom && contextmenu}
    <ContextMenu target={treeDom} items={contextmenuitems}></ContextMenu>
{/if}


<style lang="scss">
    :global(.toolbar-button) {
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
        &:focus {
            outline-color: #2276b2;
        }
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
