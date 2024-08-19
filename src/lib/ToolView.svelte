<script lang="ts">
    import { hideBottomPanel } from "./Statusbar.svelte";
    import Ellipsis from "carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte";
    import Menu from "./utility/Menu.svelte";

    export let name = "Tool";
    export let options = [];
    export let buttons = [];
</script>
<div id="toolview">
    <div class="header">{name}
        <div class="header-tools">
            {#if buttons}
            <div class="tool-buttons">
                {#each buttons as button}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class="tool-button" title={button.title} on:click={button.action}>
                        <svelte:component this={button.icon}></svelte:component>
                    </div>
                {/each}
            </div>
            {/if}
            {#if options}
                <Menu right menu={{icon: Ellipsis, children: options}}></Menu>
            {/if}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="close" title="Hide Panel" on:click={hideBottomPanel}></span>
        </div>
    </div>
    <div id="toolview-container"></div>
</div>

<style lang="scss">
#toolview {
    height: calc(100% - 37px);
    width: 100%;
}
#toolview-container {
    padding: 8px;
    height: 100%;
}
.header {
    height: 35px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
    .header-tools {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
        flex-direction: row;
        .tool-buttons {
            height: 24px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
        .tool-button {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            cursor: pointer;
        }
        :global(.menu-button), .tool-button {
            min-width: unset;
            padding: 0 7px;
            border-radius: 3px;
        }
        :global(.tool-button svg) {
            width: 18px;
            height: 18px;
        }
    }
    .close {
        font-size: 12px;
        padding: 0 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 3px;
        cursor: pointer;
        &::before {
            content: "\2715";
        }
    }
}
</style>
