<script lang="ts">
    import { afterUpdate, createEventDispatcher, onMount } from "svelte";
    import Tab from "./Tab.svelte";
    import Sortable from 'sortablejs';
    import { type Writable } from "svelte/store";
    import LeftArrow from "../../../assets/icons/left_arrow.svelte";
    import RightArrow from "../../../assets/icons/right_arrow.svelte";
    import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
    import { OverlayScrollbars, type OnUpdatedEventListenerArgs } from 'overlayscrollbars';
    import PlusSymbol from "../../../assets/icons/plus_symbol.svelte";

    export let tabs: Writable<any[]>;
    export let width = "unset";
    export let _class = "";
    export let arrowDisabled = false;
    export let canSort = false;
    export let canAdd = false;

    let tabcontainer: HTMLElement;
    let scrollbarContainer: OverlayScrollbarsComponent;
    let overflow = false;
    
    let dispatch = createEventDispatcher();
    
    onMount(() => {
        
        Sortable.create(tabcontainer, {
            draggable: canSort === true ? ".tab" : "",
            animation: 150,
            forceFallback: true,
            filter: ".close-tab",
            easing: "cubic-bezier(1, 0, 0, 1)",
            sort: canSort,
            dataIdAttr: "data-id",
            onSort(event) {
                dispatch("sort", {
                    oldIndex: event.oldIndex,
                    newIndex: event.newIndex
                })
            },
        })

        scrollbarContainer.getElement().addEventListener("wheel", (e) => {
            e.preventDefault();
            const {viewport, scrollOffsetElement} = scrollbarContainer.osInstance().elements();

            if (Math.abs(e.deltaY) > 0) {
                viewport.scrollTo({
                    left: scrollOffsetElement.scrollLeft + e.deltaY
                })
            }
        })
    })

    afterUpdate(() => {
        const last = $tabs.at(-1);
        dispatch("update", {
            last: last
        })
    })

    function handleScrollUpdate(e: CustomEvent<[instance: OverlayScrollbars, onUpdatedArgs: OnUpdatedEventListenerArgs]>) {
        const instance = e.detail[0];
        const updateEvent = e.detail[1].updateHints;
        overflow = instance.state().hasOverflow.x;

        if (updateEvent.contentMutation && overflow || updateEvent.overflowEdgeChanged) {
            const {viewport} = instance.elements();
            const tab = viewport.firstElementChild.lastElementChild;
            if (tab) {
                tab.scrollIntoView({behavior: "smooth", "inline": "start"});
            }
        }
    }
    function goToNextTab() {
        dispatch("arrow-next")
    }
    function goToPreviousTab() {
        dispatch("arrow-previous")
    }
    function addTab() {
        dispatch("add-tab");
    }

</script>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="overflow-arrows" class:overflow>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="arrow" class:arrowDisabled role="button" tabindex="-1" on:click={goToPreviousTab}><LeftArrow /></div>
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="arrow" class:arrowDisabled role="button" tabindex="-1" on:click={goToNextTab}><RightArrow /></div>
</div>

<OverlayScrollbarsComponent bind:this={scrollbarContainer} on:osUpdated={handleScrollUpdate} options={
    { scrollbars: 
        { 
            theme: 'editor-scrollbar-tabs', 
            autoHide: "leave", 
            autoHideSuspend: true, 
            autoHideDelay: 300,
    }}} defer class="overlay-scrollbars-tabs {_class}">
    <div bind:this={tabcontainer} id="tablist">
        {#each $tabs as tab}
            <Tab id={tab.id} on:closetab on:select label={tab.label} path={tab.path} active={tab.active} saved={tab.saved} />
        {/each}
        {#if canAdd}
        <div id="add-tab">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="add" title="Add New Tab" on:click={addTab}><PlusSymbol /></div>
        </div>
        {/if}
    </div>
</OverlayScrollbarsComponent>

<style lang="scss">
    :global(.overlay-scrollbars-tabs) {
        flex: 1;
        box-shadow: inset -1px 0px 0 0 var(--window-borderColor);
    }
    #tablist {
        height: 100%;
        display: flex;
    }
    #add-tab {
        align-items: center;
        box-shadow: inset 1px 0px 0 0 var(--window-borderColor);
        display: flex;
        padding: 0 5px;
        .add {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2px;
            border-radius: 2px;
            cursor: pointer;
            &:hover {
                background-color: var(--header-buttonHoverBackground);
            }
        }
        :global(svg) {
            height: 20px;
            width: 20px;
        }
    }
    #overflow-arrows {
        display: none;
        align-items: center;
        padding: 0 5px;
        gap: 5px;
        box-shadow: inset -1px 0px 0 0 var(--window-borderColor);
        .arrow {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 5px;
            border-radius: 2px;
            &.arrowDisabled {
                cursor: not-allowed;  
            }
            &:hover {
                background-color: var(--header-buttonHoverBackground);
            }
        }
        :global(svg) {
            height: 16px;
            width: 16px;
        }
        &.overflow {
            display: flex;
        }
    }
</style>