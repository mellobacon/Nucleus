<script lang="ts">
    import { Sortable } from "sortablejs";
    import { onMount } from "svelte";
    import Tab from "./Tab.svelte";
    import { closeAllTabs, hidden, tabs } from "./scripts/Tab";
    import { Add, ChevronDown, OverflowMenuVertical, Play } from "carbon-icons-svelte";
    import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
    let tabcontainer;
    export let canAdd = false;
    onMount(() => {
        Sortable.create(tabcontainer, {
            draggable: ".tab",
            animation: 150,
            forceFallback: true,
            easing: "cubic-bezier(1, 0, 0, 1)",
            sort: true
        })
    })

    let tabmenu = [
        { option: "Close All Tabs", onclick: () => { closeAllTabs() } },
    ]
</script>

<div id="editor-tabs" class:hidden={$hidden}>
    <div id="tablist" bind:this={tabcontainer}>
        {#each $tabs as tab}
            <Tab label={tab.label} path={tab.path} active={tab.active} id={tab.id} unsaved={tab.saved} />
        {/each}
    </div>
    <div class="tools">
        <div class="overflow-list">
            <ChevronDown />
        </div>
        <div class="play">
            {#if canAdd}
                <Add></Add>
            {:else}
                <Play />
            {/if}
        </div>
        <OverflowMenu flipped style="width: auto;" size="sm" title="" class="tab-settings">
            {#each tabmenu as option}
                <OverflowMenuItem on:click={option.onclick}>
                    <span class="option">{option.option}</span>
                </OverflowMenuItem>
            {/each}
        </OverflowMenu>
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
        box-shadow: inset 0px -1px 0 0 #333;
        z-index: 2;
        #tablist {
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
        .tools {
            display: flex;
            .play, .overflow-list {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                cursor: pointer;
                padding: 0 5px;
                background-color: #161616;
                box-shadow: inset 0px -1px 0 0 #333;
                &:hover {
                    background-color: #ffffff12;
                }
            }
            :global(svg) {
                width: 20px;
                height: 20px;
            }
        }
    }
</style>
