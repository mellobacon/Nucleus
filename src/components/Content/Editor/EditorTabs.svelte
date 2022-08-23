<script lang="ts">
    import { Sortable } from "sortablejs";
    import { onMount } from "svelte";
    import Tab from "./Tab.svelte";
    import { tabs, hidden } from "./Tabs";

    let tabcontainer;
    // TODO: Get this to work
    onMount(() => {
        Sortable.create(tabcontainer, {
            draggable: ".tab",
            animation: 150,
            easing: "cubic-bezier(1, 0, 0, 1)",
            sort: true
        })
    })
</script>

<div id="editor-tabs" bind:this={tabcontainer} class:hidden={$hidden}>
    {#each $tabs as tab}
        <Tab label={tab.label} path={tab.path} active={tab.active} id={tab.id} />
    {/each}
</div>

<style>
    .hidden {
        visibility: hidden;
    }
    :global(#editor-tabs) {
        width: -webkit-fill-available;
        height: 2rem;
        background-color: #333;
        display: flex;
        position: absolute;
        overflow-x: overlay;
        top: 2rem;
    }
    :global(#editor-tabs::-webkit-scrollbar) {
        height: 4px;
    }
    :global(#editor-tabs::-webkit-scrollbar-thumb) {
        background-color: #1b5fdd;
    }
</style>
