<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import Tab from "./Tab.svelte";
    import Sortable from 'sortablejs';
    import { showsidebarview } from "../Sidebar.svelte";
    import { getThemeProperty } from "../../config/themehandler";
    import { type Writable } from "svelte/store";

    export let tabs: Writable<any[]>;
    export let addTab = false;

    let tabcontainer = null;

    onMount(() => {
        Sortable.create(tabcontainer, {
            draggable: ".tab",
            animation: 150,
            forceFallback: true,
            easing: "cubic-bezier(1, 0, 0, 1)",
            sort: true
        })
    })

    afterUpdate(() => {
        // css trick to take care of the tabs overlapping the sidebar border for some reason
        if (!$showsidebarview) {
            tabcontainer.style.borderLeft = `1px solid ${getThemeProperty("window-borderColor")}`;
        }
        else {
            tabcontainer.style.borderLeft = "";
        }

        if (addTab) {
            console.log("will add tab")
            addTab = false;
        }
    })
</script>
<div bind:this={tabcontainer} id="tablist">
    {#each $tabs as tab}
        <Tab on:closetab on:select id={tab.id} label={tab.label} path={tab.path} active={tab.active} />
    {/each}
</div>

<style lang="scss">
    #tablist {
        position: relative;
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