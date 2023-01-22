<script lang="ts">
    import { closeTab, setActive } from "./scripts/Tab";
    import TabMenu from "./TabMenu.svelte";
    export let id = 0;
    export let label = "Untitled-1";
    export let path = "";
    export let active = false;
    export let unsaved = false;
    let tab;
    let contextmenu = false;
</script>
<div bind:this={tab} title={path} id={`tab-${id}`} class="tab" class:tab-active={active} class:unsaved={unsaved}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="tab-content" on:click = {
        () => {
            setActive(id);
        }
    }
    on:mousedown={(e) => {
        if (e.button === 2) {
            contextmenu = true;
        }
    }}>
        <span class="tab-label">{label}</span>
        {#if unsaved}
            <span></span>
        {/if}
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="close-tab">
        <span on:click={() => {
            closeTab(id);
        }}></span>
    </div>
</div>

{#if contextmenu}
<TabMenu target={tab} id={id} filename={label} filepath={path} />
{/if}

<style lang="scss">
    .tab {
        height: 100%;
        min-width: min-content;
        flex-grow: 0.05;
        display: flex;
        overflow: hidden;
        color: white;
        justify-content: space-between;
        align-items: center;
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
        font-size: 13px;
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