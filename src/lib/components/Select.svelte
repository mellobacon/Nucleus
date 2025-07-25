<script lang="ts">
    import ChevronDown from "../../assets/icons/chevron_down.svelte";
    import { afterUpdate, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let label= "Label";
    export let items = [
        {id: 0, name: "No items listed"},
        {id: 1, name: "No items listed1"},
        {id: 2, name: "No items listed2"},
        {id: 3, name: "No items listed3"},
    ];
    export let labelDirection: "top" | "left" = "top";

    let open = false;
    let button;
    let list;
    export let selected = items[0].name;
    const default_value = items[0];

    function handleSelect(item) {
        const name = item.name;
        selected = name;
        dispatch("select", {selection: item});
    }

    afterUpdate(() => {
        if (open && list) {
            const { width, height, top } = list.getBoundingClientRect();
            //list.style.width = `${width}px`;
            //button.style.width = `${width}px`;
        }
    })

    $: selected = items[0].name;
</script>

<svelte:window on:click={(e) => {
    if (open && !button.contains(e.target)) {
        open = false;
    }
}}></svelte:window>

<div class="select" class:label-left={labelDirection === "left"}>
    <label for="selectButton" class="label">{label}:</label>
    <div class="select-list" class:open>
        <button name="selectButton" bind:this={button} on:click={() => {open = !open}}>
            <span>{selected}</span>
            <span class="arrow"><ChevronDown></ChevronDown></span>
        </button>
        {#if open}
            <div bind:this={list} class="item-list">
                {#each items as item}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <div id={item.id.toString()} class="item" on:click={() => {
                        handleSelect(item);
                        open = false;
                    }}>
                    {item.name}
                    {#if default_value.id === 0 && item.id === 0}
                        <span class="default">default</span>
                    {/if}
                </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .select {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin: 10px 0;
        &.label-left {
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            gap: 10px;
        }
    }
    .label {
        font-size: 0.9rem;
        white-space: nowrap;
    }
    .open {
        .arrow {
            transform: rotateZ(180deg) !important;
        }
    }
    .select-list {
        min-width: 15rem;
        width: 100%;
        position: relative;
        button {
            display: flex;
            align-items: center;
            justify-content: space-between;
            min-height: 2rem;
            width: 100%;
            padding: 0 15px;
            background-color: var(--window-selectButtonBackground);
            color: var(--window-selectButtonForeground);
            span {
                display: flex;
                align-items: center;
                &:nth-child(1) {
                    margin-right: 5px;
                }
                &.arrow {
                    transform: rotateZ(0);
                    transition: 0.2s;
                    margin-top: 3px;
                    :global(svg) {
                        height: 20px;
                        width: 20px;
                    }
                }
            }
        }
    }
    .item-list {
        position: absolute;
        top: 32px;
        width: 100%;
        max-height: 15rem;
        overflow-y: overlay;
        z-index: 1;
        outline: 1px solid var(--window-borderColor);
        background-color: var(--window-selectBackground);
        .item {
            display: flex;
            align-items: center;
            min-height: 2rem;
            justify-content: space-between;
            cursor: pointer;
            padding: 0 15px;
            color: var(--window-selectButtonForeground);
            &:hover {
                background-color: var(--window-selectItemHoverBackground);
                color: var(--window-selectItemHoverForeground);
            }
        }
    }
    .default {
        color: #8c8c8c;
    }
</style>