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

<div id="editor-tabs" class:hidden={$hidden}>
    <div id="tablist" bind:this={tabcontainer}>
        {#each $tabs as tab}
            <Tab label={tab.label} path={tab.path} active={tab.active} id={tab.id} unsaved={tab.saved} />
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
        align-items: center;
        justify-content: space-between;
        position: absolute;
        box-shadow: inset 0px -1px 0 0 #333;
        #tablist {
            position: absolute;
            height: 100%;
            display: flex;
            &::-webkit-scrollbar {
                height: 4px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #ffffff12;
            }
        }
    }
</style>
