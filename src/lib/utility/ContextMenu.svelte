<script lang="ts">
    import { onMount } from "svelte";
    import { appWindow } from "@tauri-apps/api/window";

    export let items = [];
    export let target: HTMLElement = null;

    let ref = null;
    let menuOpen = false;

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
        const appWindowSize = await appWindow.innerSize();
        let windowWidth = appWindowSize.width;
        let windowHeight = appWindowSize.height;

        menuOpen = true;
        windowSize = {w: windowWidth, h: windowHeight}
        cursorPos = {x: e.clientX, y: e.clientY}

        // Adjust context menu position based on where it is on the window
        // If it overlaps with the window border then move it to the right/left/top/bottom accordingly
        if (windowSize.h -  cursorPos.y < menuPos.h) {
            cursorPos.y = cursorPos.y - menuPos.h
        }
        if (windowSize.w -  cursorPos.x < menuPos.w) {
            cursorPos.x = cursorPos.x - menuPos.w
        }
    }

    function getContextMenuDimension(node){
        // This function will get context menu dimension
        // when navigation is shown
        let height = node.offsetHeight;
        let width = node.offsetWidth;
        menuPos = {
            w: width,
            h: height
        }
    }

    $: if (target !== null) {
        target.addEventListener("contextmenu", openContextMenu)
    }
</script>

<svelte:window on:contextmenu|preventDefault={(e) => {
    menuOpen = false;
    if (target !== null) return;
    openContextMenu(e);
}} on:click={(e) => {
    menuOpen = false;
}}></svelte:window>

{#if menuOpen}
    <div use:getContextMenuDimension class="context-menu" bind:this={ref} style="top:{cursorPos.y}px; left:{cursorPos.x}px">
        {#each items as item}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
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
        background-color: #2D2D2D;
        padding: 0.25rem;
        z-index: 9999;
        position: absolute;
        box-shadow: rgb(0 0 0 / 10%) 0px 0px 4px 2px;
    }
    .context-menu-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 17px;
        padding: 5px 0;
        width: 100%;
        font-size: 0.875rem;
        cursor: pointer;
        color: #ffffff;
        &:hover {
            background-color: #414040;
        }
    }
    .option-name, .option-shortcut {
        padding: 0 10px;
    }
    .option-shortcut {
        color: #8c8c8c;
        margin-left: 10px;
        
    }
    .disabled {
        color: #6b6b6b;
        cursor: not-allowed;
    }
</style>