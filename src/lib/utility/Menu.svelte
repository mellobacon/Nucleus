<script lang="ts">
    import { afterUpdate } from 'svelte';
    export let menu;

    export let right = false;

    let button = null;
    let dropdownList = null;
    let open = false;

    afterUpdate(() => {
        if (open && dropdownList) {
            const { height , left, width, top } = button.getBoundingClientRect();
            dropdownList.style.top = `${height}px`;
            if (right) {
                dropdownList.style.right = `0px`;
                dropdownList.style.left = `auto`;
            }
            else {
                dropdownList.style.left = `${0}px`;
            }
        }
    })
</script>

<svelte:window on:click={(e) => {
    if (open && !button.contains(e.target)) {
        open = false;
    }
}}></svelte:window>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={button} class="menu-button" class:open on:click={() => {open = !open}}>
    {#if menu.icon}
        <svelte:component this={menu.icon}></svelte:component>
    {:else}
        {menu.menuname}
    {/if}
    {#if open}
        <div bind:this={dropdownList} class="menu-list">
            {#each menu.children as child}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="menu-item" class:disabled={child.disabled} on:click={() => {
                    if (!child.disabled) {
                        child.action();
                    }
                }}>
                    <span class="item-name">
                        {child.name}
                    </span>
                    {#if child.shortcut}
                        <span class="shortcut">{child.shortcut}</span>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    .menu-button {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        min-width: 2.2rem;
        padding: 0 5px;
        position: relative;
        cursor: pointer;
        :global(svg) {
            width: 18px;
            height: 18px;
        }
    }
    .menu-list {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 11.5rem;
        width: max-content;
        align-items: center;
        border-radius: 3px;
        z-index: 9999;
    }
    .menu-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 17px;
        padding: 7px 0;
        width: 100%;
        font-size: 0.875rem;
        cursor: pointer;
    }
    .item-name, .shortcut {
        padding: 0 10px;
    }
    .shortcut {
        margin-left: 20px;
    }
    .disabled {
        cursor: not-allowed;
    }
</style>