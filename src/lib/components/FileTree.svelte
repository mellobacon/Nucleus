<script lang="ts">
    import FileTreeView from "./FileTree/FileTreeView.svelte";
    import Button from "./Button.svelte";
    import { contextMenu } from "../../App.svelte";
    import { OverlayScrollbarsComponent } from "overlayscrollbars-svelte";
    import { collapseAll } from "./FileTree/FileTreeList.svelte";
    import AddFile from "../../assets/icons/add_file.svelte";
    import AddFolder from "../../assets/icons/add_folder.svelte";
    import Refresh from "../../assets/icons/refresh.svelte";
    import CollapseAll from "../../assets/icons/collapse_all.svelte";

    let treeDom: HTMLElement;
    let path = null;
    let name = null;

    function handleRightClick(e) {
        treeDom = e.detail.target;
        path = $filetree[0].path;
        name = $filetree[0].name;
        contextMenu.set({
            open: true,
            target: treeDom,
            items: [
                {name: "filetree", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Open in File Explorer", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "New Folder...", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "New File...", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Cut", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Paste", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Copy Filename", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
                {name: "Rename...", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            ]
        })
    }
</script>
<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export let fileTreetoolbar = [
        {name: "New File...", icon: AddFile},
        {name: "New Folder...", icon: AddFolder},
        {name: "Refresh Explorer", icon: Refresh},
        {name: "Collapse All Folders", icon: CollapseAll, action: () => {
            collapseAll();
        }}
    ];

    let x = [{
        id: 0, name: "FakeDir", path:"FakeDir/", children: [
            {id: 1, name: "src", path:"FakeDir/src", children: [
                {id: 2, name: "dist", path:"FakeDir/src/dist/", children: [
                    {id: 3, name: "build.asm", path:"FakeDir/src/dist/buid.asm",},
                    {id: 4, name: "model.py", path:"FakeDir/src/dist/model.py",},
                    {id: 5, name: "something", path:"FakeDir/src/dist/something",},
                ]},
                {id: 6, name: "file1", path:"FakeDir/src/file1",},
                {id: 7, name: "file2", path:"FakeDir/src/file2",},
            ]},
            {id: 8, name: "Misc", path:"FakeDir/Misc/", children: [
                {id: 9, name: "misc1.txt", path:"FakeDir/Misc/misc1.txt",},
                {id: 10, name: "misc2.png", path:"FakeDir/Misc/misc2.png",},
                {id: 12, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 13, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 14, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 15, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 16, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 17, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 18, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 19, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
            ]},
            {id: 20, name: "Thing", path:"FakeDir/Thing/", children: [
                {id: 21, name: "misc1.txt", path:"FakeDir/Misc/misc1.txt",},
                {id: 22, name: "misc2.png", path:"FakeDir/Misc/misc2.png",},
                {id: 23, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 24, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 25, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 26, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 27, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 28, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 29, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 30, name: "misc3.nucleus", path:"FakeDir/Misc/misc3.nucleus",},
                {id: 32, name: "AAA", path:"FakeDir/Thing/AAA/", children: [
                    {id: 33, name: "build.asm", path:"FakeDir/src/dist/buid.asm",},
                    {id: 34, name: "model.py", path:"FakeDir/src/dist/model.py",},
                    {id: 35, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 36, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 37, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 38, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 39, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 40, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 41, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 42, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 43, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 44, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 45, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 46, name: "something", path:"FakeDir/src/dist/something",},
                    {id: 47, name: "something", path:"FakeDir/src/dist/something",},
                ]},
            ]},
        ],
    }]

    export let filetree = writable(x);
</script>

{#if $filetree.length === 0}
    <div class="container">
        <span>No folder open</span>
        <Button _class="toolbar-button" style="accent" label="Open Folder" />
    </div>
{:else}
<OverlayScrollbarsComponent options={{ scrollbars: { theme: 'editor-scrollbar', autoHide: "leave", autoHideSuspend: true, autoHideDelay: 300 } }} defer class="overlay-scrollbars-filetree">
    <FileTreeView tree={$filetree} canDrag contextMenuEnabled on:rightclick={handleRightClick} iconsEnabled></FileTreeView>
</OverlayScrollbarsComponent>
{/if}

<style lang="scss">
    :global(.overlay-scrollbars-filetree) {
        height: 100%;
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
    }
</style>