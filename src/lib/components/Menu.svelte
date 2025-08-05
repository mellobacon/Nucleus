<script lang="ts">
    import { afterUpdate, onMount } from 'svelte';
    import type { MenuItem } from '../../scripts/Menu';
    import {activeMenu} from '../../scripts/Menu';
    import ChevronDown from '../../assets/icons/chevron_down.svelte';
    import SubMenu from './SubMenu.svelte';
    export let menu: MenuItem;

    export let right = false;
    export let isSubmenu = false;
    export let activateOnHover = false;

    let button: HTMLElement | null = null;
    let dropdownList = null;
    $: open = $activeMenu === menu;
    let submenuOpen: {
    name: string;
    shortcut?: string;
    action: any;
    disabled?: boolean;
    children?: any;
    divider?: boolean;
} | null = null;

    onMount(() => {
        if (isSubmenu) {
            menu.menu = null;
            menu.icon = null;
        }
    })

    afterUpdate(() => {
        if (open && dropdownList && button) {
            const { height } = button.getBoundingClientRect();
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

    function handleClick() {
        activeMenu.set(open ? null : menu);
    }

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

    function handleMouseEnter() {
        if ($activeMenu !== null && activateOnHover) {
            activeMenu.set(menu);
        }
    }

    function handleMouseLeave() {
        if (open) {
            //activeMenu.set(null);
        }
    }

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

<button bind:this={button} class="menu-button" class:open on:click={handleClick} on:mouseenter={handleMouseEnter} on:mouseleave={handleMouseLeave}>
    {#if menu.icon}
        <svelte:component this={menu.icon}></svelte:component>
    {:else if menu.menu}
        {menu.menu}
    {/if}
    {#if open}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div bind:this={dropdownList} class="menu-list" on:mouseenter={cancelCloseSubmenu}>
            {#each menu.children as child}
                {#if child.divider}
                    <div class="divider"></div>
                {/if}
                <div role="button" tabindex="0" class="menu-item" class:disabled={child.disabled} on:keydown on:mouseenter={(e) => {openSubmenu(e, child)}} on:click={(e) => {handleMenuItemClick(e, child)}} on:mouseleave={closeSubmenu}>
                    <span class="item-name">
                        {child.name}
                    </span>
                    {#if child.shortcut}
                        <span class="shortcut">{child.shortcut}</span>
                    {:else if child.children}
                        <svelte:component this={ChevronDown}></svelte:component>
                    {/if}
                    {#if child.children && submenuOpen === child}
                        <SubMenu {child}></SubMenu>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}
</button>

<style lang="scss">
    .menu-button {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.875rem;
        min-width: 2.2rem;
        padding: 0 8px;
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
        min-width: 17.5rem;
        width: max-content;
        align-items: center;
        border-radius: 3px;
        z-index: 9999;
        padding: 4px 0;
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
    .divider {
		width: 100%;
		height: 0.0625rem;
        min-height: 0.0625rem;
		margin: 4px 0;
	}
</style>