<script lang="ts">
    import { ContextMenuDivider, ContextMenuOption } from "carbon-components-svelte";
    import ContextMenu from "../ContextMenu/ContextMenu.svelte";
    import CopyFile from "carbon-icons-svelte/lib/CopyFile.svelte";
    import Paste from "carbon-icons-svelte/lib/Paste.svelte";
    import Cut from "carbon-icons-svelte/lib/Cut.svelte";
    import RenameModel from "../Modal/RenameModel.svelte";
    import { clipboard, invoke } from "@tauri-apps/api";
    import { updateTree } from "./scripts/TreeData";
    import Model from "../Modal/Model.svelte";
    import { closeActiveTab } from "../Tabs/scripts/Tab";
    export let target;
    export let filename;
    export let filepath;
    export let children = [];
    let open;
    let deleteopen;

    async function copyToClipboard(input) {
        await clipboard.writeText(input);
    }
</script>

<ContextMenu {target}>
    <ContextMenuOption labelText="Edit">
        <ContextMenuOption indented icon={CopyFile} labelText="Copy">
            <span class="contextshortcut" slot="shortcutText">Ctrl + C</span>
        </ContextMenuOption>
        <ContextMenuOption indented icon={Cut} labelText="Cut">
            <span class="contextshortcut" slot="shortcutText">Ctrl + X</span>
        </ContextMenuOption>
        <ContextMenuOption indented icon={Paste} labelText="Paste">
            <span class="contextshortcut" slot="shortcutText">Ctrl + V</span>
        </ContextMenuOption>
        <ContextMenuOption indented labelText="Rename..." on:click={() => {open = true}}>
            <span class="contextshortcut" slot="shortcutText">F2</span>
        </ContextMenuOption>
    </ContextMenuOption>
    <ContextMenuOption labelText="Copy Path...">
        <!--TODO: Make this relative instead of file name. Am lazy-->
        <ContextMenuOption on:click={() => copyToClipboard(filename)}>
            <span slot="labelText" title={filename}>Copy File Name</span>
        </ContextMenuOption>
        <ContextMenuOption on:click={() => copyToClipboard(filepath)}>
            <span slot="labelText" title={filepath}>Copy Absolute Path</span>
        </ContextMenuOption>
    </ContextMenuOption>
    <ContextMenuOption labelText="Show in Explorer" on:click={() => {
        invoke("open_in_explorer",{ path:filepath})
    }}></ContextMenuOption>
    <ContextMenuDivider></ContextMenuDivider>
    <ContextMenuOption labelText="Delete..." on:click={ async() => {
        deleteopen = true;
        await updateTree();
    }}>
        <span class="contextshortcut" slot="shortcutText">Delete</span>
    </ContextMenuOption>
</ContextMenu>

{#if open}
<RenameModel bind:open bind:filename={filename} bind:path={filepath} />
{/if}
{#if deleteopen}
<Model bind:open={deleteopen} heading="Delete Directory" description="Are you sure you want to delete {filename} and all its contents? Deleted files are put in your recycling bin." size="sm" buttons={[
    {name: "Move to recycle bin", action: async () => {
        await invoke("delete_file", {"path": filepath, "force": false});
        await updateTree();
        for (const child of children) {
            closeActiveTab(child.path);
        }
        deleteopen = false;
    }},
    {name: "Delete permanently", title: "Delete file permanently off of OS. Does not go into the recycling bin and cannot be undone", danger: true, action: async () => {
        await invoke("delete_file", {"path": filepath, "force": false});
        await updateTree();
        for (const child of children) {
            closeActiveTab(child.path);
        }
        deleteopen = false;
    }}
]}
></Model>
{/if}

<style>
    .contextshortcut {
        color: #8c8c8c;
    }
</style>