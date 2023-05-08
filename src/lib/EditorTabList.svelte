<script lang="ts">
    import { afterUpdate, onMount } from "svelte";
    import Tab from "./Tab.svelte";
    import { tabs, hidden, CloseAllTabs } from "./scripts/Tab";
    import Sortable from 'sortablejs';
    import VerticalDots from "carbon-icons-svelte/lib/OverflowMenuVertical.svelte";
    import Dropdown from "./utility/Dropdown.svelte";
    import { showsidebarview } from "./Sidebar.svelte";
    import { getThemeProperty } from "../config/themehandler";

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
    })
</script>
<div id="editor-tabs" class:hidden={$hidden}>
    <div bind:this={tabcontainer} id="editor-tablist">
        {#each $tabs as tab}
            <Tab id={tab.id} label={tab.label} path={tab.path} active={tab.active} />
        {/each}
    </div>
    <div class="tab-toolbar">
        <Dropdown right menu={{icon: VerticalDots, children: [
            {name: "Close All Tabs", action: () => {CloseAllTabs()}},
            {name: "Close Saved Tabs", disabled: true}
        ]}}></Dropdown>
    </div>
</div>

<style lang="scss">
    .hidden {
        visibility: hidden;
    }
    #editor-tabs {
        width: -webkit-fill-available;
        display: flex;
        justify-content: space-between;
        #editor-tablist {
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
    }
    .tab-toolbar {
        height: 100%;
        display: flex;
        align-items: center;
        color: white;
        padding: 0 5px;
    }
</style>