<script lang="ts">
    import { onMount } from "svelte";
    import Searchbar from "./Searchbar.svelte";
    import { Commands } from "../../config/commands";

    let open = false;
    let title = "Command Palette";
    let placeholder = "Type a command..."
    let overlay: HTMLElement;
    let searchbar;

    export let list = Commands.getNamedCommands();
    const defaultList = [...list];

    onMount(() => {
        open = true;
        onkeydown = (e) => {
            if (e.code === "Escape") {
                close(null);
            }
        }
    })

    function close(e) {
        if (e && e.target instanceof HTMLInputElement) return;
        open = false;
    }
    function handleInput(e) {
        let value: string = e.detail.value;
        list = defaultList.filter(i => i.text.toLowerCase().startsWith((value.toLowerCase())));
    }
</script>

{#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div id="overlay" bind:this={overlay} on:click|stopPropagation={close}>
        <div id="command-palette">
            <div class="top">
                {title}
            </div>
            <Searchbar bind:this={searchbar} fluid height="30px" placeholder={placeholder} autofocus on:d_input={handleInput} input_delay={1} />
            <div class="commandlist">
                {#each list as item}
                    <div class="search-item" on:click={(e) => {item.command(); close(e);}}>
                        <span class="item-name">{item.text}</span>
                        {#if item.shortcut}
                            <span class="shortcut">{item.shortcut}</span>
                        {/if}
                    </div>
                {/each}
            </div>
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
        max-height: 30vh;
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
        .commandlist {
            overflow-y: auto;
            overflow-x: hidden;
            height: 100%;
            width: 100%;
        }
        .search-item {
            padding: 2px 0.5rem;
            border-radius: 2px;
            font-size: 0.875rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            &:hover {
                background-color: var(--window-menuItemHoverBackground);
            }
            .shortcut {
                margin-left: 20px;
            }
        }
    }
</style>