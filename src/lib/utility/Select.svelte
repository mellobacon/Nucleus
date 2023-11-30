<script lang="ts">
    import { ChevronDown } from "carbon-icons-svelte";
    import { afterUpdate, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let label: string;
    export let items = [
        {id: 0, name: "No items listed"},
    ];

    let open = false;
    let button;
    let list;
    export let selected = items[0].name;
    const default_value = selected;

    function handleSelect(item) {
        const name = item.name;
        selected = name;
        dispatch("select", {selection: item});
    }

    afterUpdate(() => {
        if (open && list) {
            const { _ , width } = button.getBoundingClientRect();
            list.style.width = `${width}px`;
        }
    })

    $: selected = items[0].name;
</script>

<svelte:window on:click={(e) => {
    if (open && !button.contains(e.target)) {
        open = false;
    }
}}></svelte:window>

<div class="select">
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
                    <div id={item.id.toString()} class="item" on:click={() => {
                        handleSelect(item);
                        open = false;
                    }}>
                    {item.name}
                    {#if default_value === item.name}
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
    }
    .label {
        font-size: 0.9rem;
    }
    .open {
        .arrow {
            transform: rotateZ(180deg) !important;
        }
    }
    .select-list {
        min-width: 7rem;
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 2rem;
            width: 100%;
            padding: 0 20px;
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
                }
            }
        }
    }
    .item-list {
        position: absolute;
        max-height: 15rem;
        overflow-y: overlay;
        min-width: 20rem;
        z-index: 1;
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #4c4c4c38;
        }
        .item {
            display: flex;
            align-items: center;
            min-height: 2rem;
            justify-content: space-between;
            cursor: pointer;
            padding: 0 20px;
        }
    }
    .default {
        color: #8c8c8c;
    }
</style>