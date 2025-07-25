<script lang="ts">
    import { onMount } from 'svelte';
    import ChevronDown from '../../assets/icons/chevron_down.svelte';
    export let child;

    let submenu: HTMLElement;
    let submenuOpen: {
        name: string;
        shortcut?: string;
        action: any;
        disabled?: boolean;
        children?: any;
    } | null = null;
    
    function handleMenuItemClick(event: MouseEvent, child: {
        name: string;
        shortcut?: string;
        action: any;
        disabled?: boolean;
        children?: any;
    }) {
        if (!child.disabled && child.action) {
            child.action();
        }
    }

    onMount(() => {
        if (submenu) {
            let windowSize = document.body.getBoundingClientRect().width;
            submenu.style.top = `${submenu.parentElement.getBoundingClientRect().top - 35}px`;
            if (windowSize <= 530) {
                submenu.style.left = `${windowSize - submenu.getBoundingClientRect().width}px`;
            }
            else {
                submenu.style.left = "100%"
            }
        }
    })

    let openSubmenuTimeout = null;
    function openSubmenu(event: MouseEvent, child: {
        name: string;
        shortcut?: string;
        action: any;
        disabled?: boolean;
        children?: any;
    }) {
        openSubmenuTimeout = setTimeout(() => {
            if (child.children) {
                submenuOpen = child;
            }
        }, 250)
    }
    let closeSubmenuTimeout = null;
    function closeSubmenu() {
        if (openSubmenuTimeout) {
            clearTimeout(openSubmenuTimeout);
            openSubmenuTimeout = null;
        }
        if (submenuOpen) {
            closeSubmenuTimeout = setTimeout(() => {
                submenuOpen = null;
            }, 600)
        }
    }

    function cancelCloseSubmenu() {
        // Cancel the close action if the user hovers back into the submenu or its parent
        if (closeSubmenuTimeout) {
            clearTimeout(closeSubmenuTimeout);
            closeSubmenuTimeout = null;
        }
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="submenu" bind:this={submenu} on:mouseenter={cancelCloseSubmenu}>
    {#each child.children as subChild}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div role="button" tabindex="0" class="menu-item" class:disabled={subChild.disabled} on:mouseenter={(e) => {openSubmenu(e, subChild)}} on:click={(e) => handleMenuItemClick(e, subChild)} on:mouseleave={closeSubmenu}>
            <span class="item-name">{subChild.name}</span>
            {#if subChild.shortcut}
                <span class="shortcut">{subChild.shortcut}</span>
            {:else if subChild.children}
                <svelte:component this={ChevronDown}></svelte:component>
            {/if}
            {#if subChild.children && submenuOpen === subChild}
                <svelte:self child={subChild}></svelte:self>
            {/if}
        </div>
    {/each}
</div>

<style lang="scss">
    .submenu {
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
        :global(svg) {
            transform: rotateZ(270deg);
            margin-right: 5px;
        }
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