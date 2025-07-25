<script lang="ts">
    import { onMount } from "svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { contextMenu } from "../../App.svelte";

    export let items = [];
    export let target: HTMLElement = null;

    export let menuOpen = false;

    let cursorPos = { x: 0, y: 0 }
    let menuPos = { h: 0, w: 0 }
    let windowSize = { h: 0, w: 0 } // keep track of window borders

    onMount(() => {
        return () => {
            if (target !== null) {
                target.removeEventListener("contextmenu", openContextMenu)
            }
        }
    })

    async function openContextMenu(e) {
        if (!target || target === null) {
            return;
        }
        const appWindowSize = await getCurrentWindow().innerSize();
        let windowWidth = appWindowSize.width;
        let windowHeight = appWindowSize.height;

        menuOpen = true;
        windowSize = {w: windowWidth, h: windowHeight};
        cursorPos = {x: e.clientX, y: e.clientY};

        // Adjust context menu position based on where it is on the window
        // If it overlaps with the window border then move it to the right/left/top/bottom accordingly
        if (windowSize.h -  cursorPos.y < menuPos.h) {
            cursorPos.y = cursorPos.y - menuPos.h
        }
        if (windowSize.w -  cursorPos.x < menuPos.w) {
            cursorPos.x = cursorPos.x - menuPos.w
        }
    }

    function getContextMenuDimension(node: HTMLDivElement){
        // This function will get context menu dimension
        // when navigation is shown
        let height = node.offsetHeight;
        let width = node.offsetWidth;
        menuPos = {
            w: width,
            h: height
        }
    }

    function closeContextMenu() {
        menuOpen = false;
        $contextMenu.open = false;
    }

    $: if (target !== null) {
        target.addEventListener("contextmenu", openContextMenu)
    }
</script>

<svelte:window on:contextmenu|preventDefault on:click={closeContextMenu}></svelte:window>

{#if menuOpen}
<div use:getContextMenuDimension class="context-menu" style="top:{cursorPos.y}px; left:{cursorPos.x}px">
    {#each items as item}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="context-menu-option" title="" class:disabled={item.disabled} on:click={() => {
            if (!item.disabled) {
                item.action();
            }
        }}>
            <span class="option-name">{item.name}</span>
            {#if item.shortcut}
                <span class="option-shortcut">{item.shortcut}</span>
            {/if}
        </div>
    {/each}
</div>
{/if}

<style lang="scss">
    .context-menu {
        min-width: 10rem;
        max-width: 18rem;
        padding: 0.25rem;
        z-index: 9999;
        position: absolute;
        border-radius: 3px;
        border: 1px solid var(--window-borderColor);
    }
    .context-menu-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 17px;
        padding: 6px 0;
        width: 100%;
        font-size: 0.875rem;
        cursor: pointer;
        border-radius: 1.5px;
    }
    .option-name, .option-shortcut {
        padding: 0 10px;
    }
    .option-shortcut {
        margin-left: 10px;
    }
    .disabled {
        cursor: not-allowed;
    }
</style>