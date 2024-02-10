<script lang="ts">
    import { hideBottomPanel } from "./Statusbar.svelte";
    import Ellipsis from "carbon-icons-svelte/lib/OverflowMenuHorizontal.svelte";
    import Menu from "./utility/Menu.svelte";
    import { clearTerminal } from "./Terminal.svelte";

    export let content = null;
    export let name = "Tool";
</script>
<div id="toolview">
    <div class="header">{name}
        <div class="header-tools">
            <div class="tool-buttons">
                <Menu right menu={{icon: Ellipsis, children: [
                    {name: "Clear Terminal", action: () => {
                    clearTerminal();
                }},]}}></Menu>
            </div>
            <span class="close" on:click={hideBottomPanel}></span>
        </div>
    </div>
    <div class="toolview-container">
        <svelte:component this={content}></svelte:component>
    </div>
</div>

<style lang="scss">
#toolview {
    height: calc(100% - 37px);
    width: 100%;
}
.toolview-container {
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
        }
        :global(.menu-button) {
            min-width: unset;
            padding: 0 7px;
            border-radius: 3px;
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
