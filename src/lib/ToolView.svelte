<script lang="ts">
    import { showBottomPanel } from "./Statusbar.svelte";

    export let content = null;
    export let name = "Tool";

    function closePanel() {
        showBottomPanel.set(false);
    }
</script>
<div id="toolview">
    <div class="header">{name} <span class="close" on:click={closePanel}></span></div>
    <svelte:component this={content}></svelte:component>
</div>

<style lang="scss">
#toolview {
    height: calc(100% - 37px);
    width: 100%;
}
.header {
    height: 35px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px;
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