<script lang="ts">
    import { onMount } from "svelte";
    import Tab from "./Tab.svelte";
    import Sortable from 'sortablejs';
    import { type Writable } from "svelte/store";

    export let tabs: Writable<any[]>;
    export let width = "unset";

    let tabcontainer = null;

    onMount(() => {
        Sortable.create(tabcontainer, {
            draggable: ".tab",
            animation: 150,
            forceFallback: true,
            filter: ".close-tab",
            easing: "cubic-bezier(1, 0, 0, 1)",
            sort: true
        })
    })
</script>
<div bind:this={tabcontainer} id="tablist" style="max-width: {width}">
    {#each $tabs as tab}
        <Tab on:closetab on:select id={tab.id} label={tab.label} path={tab.path} active={tab.active} saved={tab.saved} />
    {/each}
</div>

<style lang="scss">
    #tablist {
        display: flex;
        overflow-x: overlay;
        &::-webkit-scrollbar {
            height: 5px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #e8e8e81f;
        }
    }
</style>