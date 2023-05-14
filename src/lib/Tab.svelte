<script lang="ts">
    import { setActive, closeTab } from "./scripts/Tab";
    import ContextMenu from "./utility/ContextMenu.svelte";

    export let id = 0;
    export let label = "Untitled-1";
    export let path = "";
    export let active = false;

    let tab = null;

    let contextmenu = false;
    let contextmenuitems = [
        {name: "Close Tab", shortcut: "AHHH", action: () => {console.log("click")}},
        {name: "Close Others", shortcut: "Ctrl + C", action: () => {console.log("click")}},
        {name: "Close All Right", shortcut: "Ctrl + X", action: () => {console.log("click")}},
        {name: "Close All Left", shortcut: "AHHH", action: () => {console.log("click")}},
        {name: "Close All Saved", shortcut: "AHHH", action: () => {console.log("click")}},
        {name: "Close All", shortcut: "AHHH", action: () => {console.log("click")}},
        {name: "Copy Filename", shortcut: "F2", disabled: true, action: () => {console.log("click")}},
        {name: "Copy Absolute Path", shortcut: "F2", disabled: true, action: () => {console.log("click")}},
        {name: "Show In File Explorer", shortcut: "Delete", action: () => {console.log("click")}}
    ]
</script>
<div bind:this={tab} title={path} id={`editorTab-${id}`} class="tab" class:active={active}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="tab-content" on:mousedown = {
        (e) => {
            if (e.button === 0) setActive(id);
            if (e.button === 2) contextmenu = true;
        }
    }>
        <span class="tab-label">{label}</span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="close-tab">
        <span title="Close tab" on:click={() => {closeTab(id)}}></span>
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
        :nth-child(2) {
            display: block;
            width: 6px;
            height: 6px;
            background-color: white;
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
    .close-tab span::before {
        content: "\2715";
        font-size: 11px;
        display: flex;
    }
    .close-tab span:hover {
        color: gray;
    }
    .close-tab {
        width: 2rem;
        margin-left: -1rem;
        display: flex;
        justify-content: center;
        position: relative;
        left: 10px;
    }
</style>