<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import ContextMenu from "../utility/ContextMenu.svelte";
    import { commands } from "../../config/commands";
    const dispatch = createEventDispatcher();

    export let id = 0;
    export let label = "Untitled-1";
    export let path = "";
    export let active = false;
    export let saved = true;

    let tab = null;

    function handleSelect(tabid) {
        dispatch("select", {tabid: tabid})
    }
    function handleClose(tabid) {
        dispatch("closetab", {tabid: tabid});
    }

    let contextmenu = false;
    let contextmenuitems = [
        {name: "Close Tab", shortcut: commands.closeTab.keybind, action: () => {handleClose(id)}},
        {name: "Close All Tabs", shortcut: "", action: commands.closeAllTabs.command},
        {name: "Open In Explorer", disabled: path === label, shortcut: commands.openInExplorer.keybind, action: () => {commands.openInExplorer.command(path)}},
        {name: "Rename File", disabled: path === label, shortcut: commands.renameFile.keybind, action: () => {commands.renameFile.command(label, path)}},
    ]
</script>
<div bind:this={tab} title={path} id={`editorTab-${id}`} class="tab" class:active={active}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="tab-content" on:mousedown = {(e) => { if (e.button === 0) handleSelect(id);}} on:mouseup={(e) => {if (e.button === 2) contextmenu = true;}}>
        <span class="tab-label">{label}</span>
        <span class="save-state" class:saved></span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="close-tab">
        <span title="Close tab" on:click={() => {handleClose(id)}}></span>
    </div>
</div>

{#if contextmenu}
    <ContextMenu target={tab} items={contextmenuitems}></ContextMenu>
{/if}

<style lang="scss">
    .tab {
        height: 100%;
        min-width: min-content;
        flex-grow: 0.05;
        display: flex;
        overflow: hidden;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        cursor: pointer;
        padding: 0 10px;
    }
    .tab-content::-webkit-scrollbar {
        height: 4px;
    }
    .tab-content::-webkit-scrollbar {
        background-color: #1b5fdd;
    }
    .tab-content {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow-x: overlay;
        overflow-y: hidden;
        height: 100%;
        padding-left: 2px;
        .save-state {
            &.saved {
                display: none !important;   
            }
            display: block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            left: -11px;
            top: 0.5px;
            position: relative;
        }
    }
    .tab-label {
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 20px;
    }
    .close-tab span {
        font-size: 11px;
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        align-items: center;
        &::before {
            content: "\2715";
        }
    }
    .close-tab span:hover {
        transition: 0.1s;
        border-radius: 3px;
    }
    .close-tab {
        width: 18px;
        height: 18px;
        margin-left: -0.5rem;
        margin-right: 0.5rem;
        display: flex;
        justify-content: center;
        position: relative;
        left: 10px;
    }
</style>