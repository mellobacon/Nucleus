<script lang="ts">
    import { onMount } from "svelte";
    import Searchbar from "./Searchbar.svelte";

    let open = false;
    let overlay: HTMLElement;

    onMount(() => {
        open = true;
    })

    function close(e) {
        if (e.target !== overlay) return;
        open = false;
    }
</script>

{#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div id="overlay" bind:this={overlay} on:click|stopPropagation={close}>
        <div id="command-palette">
            <div class="top">
                Command Palette
            </div>
            <Searchbar fluid height="30px" placeholder="> Type a command..." autofocus />
        </div>
    </div>
{/if}

<style lang="scss">
    #overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding-top: 7vh;
        z-index: 999;
    }
    #command-palette {
        border-radius: 2px;
        padding: 10px;
        width: 80%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        background: var(--window-background);
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 6px var(--window-boxShadow);
        display: flex;
        flex-direction: column;
        outline: 1px solid var(--window-borderColor);
        gap: 10px;
        z-index: 1000;
        .top {
            width: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid var(--window-borderColor);
            padding: 5px 0;
        }
    }
</style>