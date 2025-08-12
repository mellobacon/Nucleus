<script lang="ts">
    import { afterUpdate, createEventDispatcher } from "svelte";
    import Close from "../../../assets/icons/close.svelte";
    const dispatch = createEventDispatcher();

    export let id = 0;
    export let label = "Untitled-1";
    export let path = "";
    export let active = false;
    export let saved = true;

    let tab = null;

    afterUpdate(() => {
        if (active) scrollIntoView();
    })

    function scrollIntoView() {
        tab.scrollIntoView({behavior: "smooth", "inline": "center"});
    }

    function handleSelect(tabid) {
        dispatch("select", {tabid: tabid})
    }
    function handleClose(tabid) {
        dispatch("closetab", {tabid: tabid});
    }
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div bind:this={tab} title={path} id={`editorTab-${id}`} data-id={id} class="tab" class:active={active} on:mousedown = {(e) => {
        if (!tab.contains(e.target)) return;
        if (e.button === 0) handleSelect(id);
    }}>
    <div class="border"></div>
    <div class="tab-content">
        <span class="tab-label">{label}</span>
        <span class="save-state" class:saved></span>
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="close-tab">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <span title="Close tab" on:click={() => {handleClose(id)}}>
            <Close />
        </span>
    </div>
</div>

<style lang="scss">
    .tab {
        height: 100%;
        min-width: min-content;
        max-width: 230px;
        display: flex;
        overflow: hidden;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
        position: relative;
        cursor: pointer;
        padding: 0 10px;
        background-color: var(--editor-tabBackground);
        color: var(--editor-tabForeground);
        box-shadow: inset 0px -1px 0 0 var(--editor-tabBorderColor);
        .border {
            width: 100%;
            height: 3px;
            position: absolute;
            top: 0;
            left: 0;
            box-shadow: inset 0px 1px 0 0 var(--header-borderColor);
        }
        &:not(.active):hover {
            background-color: var(--editor-tabHoverBackground);
            color: var(--editor-tabHoverForeground);
        }
        &.active {
            background-color: var(--editor-tabActiveBackground);
            color: var(--editor-tabActiveForeground);
            box-shadow: none;
            .border {
                background-color: var(--editor-tabActiveBorderColor);
                box-shadow: none;
            }
        }
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
            background-color: var(--editor-tabSaveStateColor);
        }
    }
    .tab-label {
        text-overflow: ellipsis;
        white-space: nowrap;
        padding-right: 20px;
        overflow: hidden;
    }
    .close-tab span {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 100%;
        align-items: center;
        :global(svg) {
            width: 14px;
            height: 14px;
        }
    }
    .close-tab span:hover {
        transition: 0.1s;
        border-radius: 3px;
        background-color: var(--editor-tabBorderColor);
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