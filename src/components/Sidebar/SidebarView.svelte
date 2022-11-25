<script lang="ts">
    export let title: string;
    export let content = null;
</script>
<div id="sidebarview">
	<div class="tool-header">
        <span>{title}</span>
    </div>
    {#if content}
        <div id="tool-view">
            <svelte:component this={content}></svelte:component>
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
    .tool-header {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 2rem;
        border-bottom: 1px solid #333;
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