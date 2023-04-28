<script lang="ts">
    import { afterUpdate } from 'svelte';
    export let menu;

    let button = null;
    let dropdownList = null;
    let open = false;

    afterUpdate(() => {
        if (open && dropdownList) {
            const { height , left } = button.getBoundingClientRect();
            dropdownList.style.top = `${height}px`;
            dropdownList.style.left = `${left}px`;
            // TODO: make toggle for showing dropdown on the right of the button
        }
    })
</script>

<svelte:window on:click={(e) => {
    if (open && !button.contains(e.target)) {
        open = false;
    }
}}></svelte:window>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div bind:this={button} class="dropdown-button" on:click={() => {open = !open}}>
    {#if menu.icon}
        <svelte:component this={menu.icon}></svelte:component>
    {:else}
        {menu.menuname}
    {/if}
</div>

{#if open}
    <div bind:this={dropdownList} class="dropdown-list">
        {#each menu.children as child}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="dropdown-item" on:click={child.action}>
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

<style lang="scss">
    .dropdown-button {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        min-width: 2.2rem;
        padding: 0 5px;
        :global(svg) {
            width: 18px;
            height: 18px;
        }
    }
    .dropdown-list {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 11.5rem;
        align-items: center;
        padding: 3px 0;
        box-shadow: rgb(0 0 0 / 10%) 0px 0px 4px 2px;
        border-radius: 3px;
    }
    .dropdown-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 17px;
        padding: 5px 0;
        width: 100%;
        font-size: 0.875rem;
    }
    .item-name, .shortcut {
        padding: 0 10px;
    }
    .shortcut {
        color: #8c8c8c;
        margin-left: 20px;
    }
</style>