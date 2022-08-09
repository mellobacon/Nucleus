<script lang="ts">
    import { ContextMenuDivider, ContextMenuGroup, ContextMenuOption } from "carbon-components-svelte";
    import ContextMenu from "../ContextMenu/ContextMenu.svelte";
    import RenameModel from "../Modal/RenameModel.svelte";
    import CopyFile from "carbon-icons-svelte/lib/CopyFile.svelte";
    import Paste from "carbon-icons-svelte/lib/Paste.svelte";
    import Cut from "carbon-icons-svelte/lib/Cut.svelte";
    import Script from "carbon-icons-svelte/lib/Script.svelte";
    export let target;
    export let filename;
    export let path;
    let open;
</script>

<ContextMenu {target}>
    <ContextMenuOption labelText="Edit">
        <ContextMenuOption indented icon={CopyFile} labelText="Copy">
            <span class="contextshortcut" slot="shortcutText">Ctrl + C</span>
        </ContextMenuOption>
        <ContextMenuOption indented icon={Cut} labelText="Cut">
            <span class="contextshortcut" slot="shortcutText">Ctrl + X</span>
        </ContextMenuOption>
        <ContextMenuOption indented labelText="Rename..." on:click={() => {open = true}}>
            <span class="contextshortcut" slot="shortcutText">F2</span>
        </ContextMenuOption>
        <ContextMenuOption indented icon={Script} labelText="Edit {filename}"></ContextMenuOption>
    </ContextMenuOption>
    <ContextMenuOption labelText="Copy Path...">
        <ContextMenuOption labelText="Copy Relative Path"></ContextMenuOption>
        <ContextMenuOption labelText="Copy Absolute Path"></ContextMenuOption>
    </ContextMenuOption>
    <ContextMenuOption labelText="Show in Explorer"></ContextMenuOption>
    <ContextMenuDivider></ContextMenuDivider>
    <ContextMenuOption labelText="Delete...">
        <span class="contextshortcut" slot="shortcutText">Delete</span>
    </ContextMenuOption>
</ContextMenu>

<RenameModel bind:open bind:filename={filename} bind:path={path} />

<style>
    .contextshortcut {
        color: #8c8c8c;
    }
</style>