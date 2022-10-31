<script lang="ts">
    import { Sortable } from "sortablejs";
    import { onMount } from "svelte";
    import Tab from "./Tab.svelte";
    import { hidden, tabs } from "./scripts/Tab";
    let tabcontainer;
    onMount(() => {
        Sortable.create(tabcontainer, {
            draggable: ".tab",
            animation: 150,
            forceFallback: true,
            easing: "cubic-bezier(1, 0, 0, 1)",
            sort: true
        })
    })
</script>

<div id="editor-tabs" bind:this={tabcontainer} class:hidden={$hidden}>
    {#each $tabs as tab}
        <Tab label={tab.label} path={tab.path} active={tab.active} id={tab.id} saved={tab.saved} />
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
        background-color: #ffffff12;
    }
</style>
