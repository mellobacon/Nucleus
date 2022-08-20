<script lang="ts">
    import { setActive, closeTab } from "./Tabs";
    export let id = 0;
    export let label = "Untitled-1";
    export let active = false;
    export let unsaved = false;
</script>
<div id={`tab-${id.toString()}`} class="tab" class:tab-active={active} class:unsaved={unsaved} on:click = {
    () => {
        setActive(id);
    }
}>
    <div class="tab-content">
        <span class="tab-label">{label}</span>
    </div>
    <div class="close-tab" on:click={() => {
        closeTab(id);
    }}>
        <span></span>
    </div>
</div>

<style>
    .tab {
        background-color: rgb(58 58 58);
        height: 100%;
        min-width: 150px;
        flex-grow: 0.05;
        display: flex;
        overflow: hidden;
        color: white;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        box-shadow: inset 0px -0.5px 0 0 #bdd4ff;
    }
    .tab:not(.tab-active):hover {
        background-color: rgb(43, 43, 43);
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
        margin-left: 2rem;
        overflow-x: overlay;
        overflow-y: hidden;
        height: 100%;
    }
    .tab-active {
        background-color: rgb(28, 28, 28);
        box-shadow: inset 0px -2px 0 0 #1b5fdd !important;
    }
    .tab-active.unsaved {
        box-shadow: inset 0px -2px 0 0 #dd6f1b !important;
    }
    .unsaved {
        box-shadow: inset 0px -0.5px 0 0 #dd6f1b;
    }
    .tab-label {
        text-overflow: ellipsis;
        overflow-x: clip;
        white-space: nowrap;
        padding-right: 20px;
    }
    .close-tab span::before {
        content: "\2715";
        line-height: 30px;
    }
    .close-tab span:hover {
        color: gray;
    }
    .close-tab {
        width: 2rem;
        margin-right: .25rem;
        margin-left: -1rem;
        display: flex;
        justify-content: center;
    }
</style>