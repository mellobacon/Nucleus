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
        {name: "Open in File Explorer", shortcut: "", action: () => {console.log("click")}},
        {name: "Copy", shortcut: "Ctrl + C", action: () => {console.log("click")}},
        {name: "Cut", shortcut: "Ctrl + X", action: () => {console.log("click")}},
        {name: "Paste", shortcut: "Ctrl + X", disabled: true, action: () => {console.log("click")}},
        {name: "Copy Filename", shortcut: "", action: () => {console.log("click")}},
        {name: "Copy Absolute Path", shortcut: "", action: () => {console.log("click")}},
        {name: "Rename...", shortcut: "F2", disabled: true, action: () => {console.log("click")}},
        {name: "Delete", shortcut: "Delete", action: () => {console.log("click")}}
    ]
</script>

<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export let filetree = writable([{
        id: 0, label: "FakeDir", path:"FakeDir/", children: [
            {id: 1, label: "src", path:"FakeDir/src", children: [
                {id: 2, label: "dist", path:"FakeDir/src/dist/", children: [
                    {id: 3, label: "build.asm", path:"FakeDir/src/dist/buid.asm",},
                    {id: 4, label: "model.py", path:"FakeDir/src/dist/model.py",},
                    {id: 5, label: "something", path:"FakeDir/src/dist/something",},
                ]},
                {id: 6, label: "file1", path:"FakeDir/src/file1",},
                {id: 7, label: "file2", path:"FakeDir/src/file2",},
            ]},
            {id: 8, label: "Misc", path:"FakeDir/Misc/", children: [
                {id: 9, label: "misc1.txt", path:"FakeDir/Misc/misc1.txt",},
                {id: 10, label: "misc2.png", path:"FakeDir/Misc/misc2.png",},
                {id: 11, label: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
            ]},
        ],
    }]);
</script>

{#if $filetree.length === 0}
    <div class="container">
        <span>No folder/workspace open</span>
        <button class="toolbar-button">Open Folder</button>
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