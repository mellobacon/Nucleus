<script lang="ts">
    import { ChevronDown } from "carbon-icons-svelte";
    import { afterUpdate, createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let label: string;
    export let items = [];

    let open = false;
    let button;
    let list;

    function handleSelect(name) {
        selected = name;
        dispatch("select", {selection: name});
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

<div class="dropdown">
    <span class="label">{label}:</span>
    <div class="dropdown-list" class:open>
        <button bind:this={button} on:click={() => {open = !open}}>
            <span>{selected}</span>
            <span class="arrow"><ChevronDown></ChevronDown></span>
        </button>
        {#if open}
            <div bind:this={list} class="item-list">
                {#each items as item}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div id={item.id} class="item" on:click={() => {
                        handleSelect(item.name);
                        open = false;
                    }}>{item.name}</div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    .dropdown {
        display: flex;
        align-items: center;
        margin: 10px 0;
    }
    .open {
        .arrow {
            transform: rotateZ(180deg) !important;
        }
    }
    .dropdown-list {
        margin-left: 10px;
        min-width: 10rem;
        button {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 2rem;
            width: 100%;
            border: 1px solid #333;
            background-color: #1f1f1f;
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
                }
            }
        }
    }
    .item-list {
        position: absolute;
        border: 1px solid #333;
        background-color: #1f1f1f;
        max-height: 15rem;
        overflow-y: overlay;
        min-width: 20rem;
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
            cursor: pointer;
            padding: 0 20px;
            &:hover {
                background-color: #373737;
            }
        }
    }
</style>