<script lang="ts">
    export let content = null;
</script>
<div id="sidebarview">
    {#if content}
        <div id="tool-view">
            <!---
            <svelte:component this={content}></svelte:component>
            -->
            {content}
        </div>
    {/if}
</div>

<style lang="scss">
    #sidebarview {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
	#tool-view {
        width: 100%;
        overflow-y: auto;
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #4c4c4c38;
        }
    }
</style>