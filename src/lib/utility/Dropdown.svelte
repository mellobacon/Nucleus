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

{#if menu.menuname}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div bind:this={button} class="dropdown-button" on:click={() => {open = !open}}>
        {menu.menuname}
    </div>
{/if}
{#if menu.icon}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div bind:this={button} class="dropdown-button" on:click={() => {open = !open}}>
        <svelte:component this={menu.icon}></svelte:component>
    </div>
{/if}

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
        font-size: 14px;
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
        min-width: 11rem;
        align-items: center;
        padding: 3px 0;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    }
    .dropdown-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 17px;
        padding: 5px;
        width: 100%;
        font-size: 14px;
    }
    .item-name, .shortcut {
        padding: 0 10px;
    }
    .shortcut {
        color: #8c8c8c;
        margin-left: 20px;
    }
</style>