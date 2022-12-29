<script lang="ts">
    import TreeView from "../FileTree/TreeView.svelte";
</script>
<script lang="ts" context="module">
    import { writable } from "svelte/store";

    let tree = [
        {id: 0, path: "general", name: "General", children: [
            {id: 1, path: "file1", name: "Appearance"},
            {id: 2, path: "file1", name: "Shortcuts"},
        ]},
    ];
    export let setting = writable(`${tree[0].name}/${tree[0].children[0].name}`);
    function openSetting(event) {
        let node = event.detail;
        setting.set(`${node.parent.name}/${node.name}`);
    }
</script>

<TreeView children={tree} size="compact" expanded on:select={openSetting}></TreeView>