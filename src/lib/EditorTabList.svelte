<script lang="ts">
    import { onMount } from "svelte";
    import Tab from "./Tab.svelte";
    import { tabs, hidden } from "./scripts/Tab";
    import Sortable from 'sortablejs';

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
</script>
<div id="editor-tabs" class:hidden={$hidden}>
    <div bind:this={tabcontainer} id="editor-tablist">
        {#each $tabs as tab}
            <Tab id={tab.id} label={tab.label} path={tab.path} active={tab.active} />
        {/each}
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
        position: absolute;
        left: 0.5px; /*temp fix to show over the sidebar border*/
        #editor-tablist {
            position: relative;
            display: flex;
            overflow-x: overlay;
            &::-webkit-scrollbar {
                height: 7px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #e8e8e81f;
            }
        }
    }
</style>