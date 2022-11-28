<script lang="ts">
    import TreeView from "../FileTree/TreeView.svelte";
    let tree = [
        {id: 0, path: "general", name: "General", children: [
            {id: 1, path: "file1", name: "Appearance"},
            {id: 2, path: "file1", name: "Shortcuts"},
        ]},
        {id: 3, path: "file1", name: "Editor", children: [
            {id: 4, path: "file1", name: "Appearance"},
            {id: 5, path: "file1", name: "Files"},
            {id: 6, path: "file1", name: "Code"},
        ]},
    ];
</script>
<script lang="ts" context="module">
    import { writable } from "svelte/store";

    export let setting = writable("");
    function openSetting(event) {
        let node = event.detail;
        setting.set(`${node.parent.name}/${node.name}`);
    }
</script>

<TreeView children={tree} size="compact" on:select={openSetting}></TreeView>