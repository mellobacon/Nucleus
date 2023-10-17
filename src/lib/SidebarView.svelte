<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { treeLoading, dirToLoad, dirLoadFail } from "./File";
    import ProgressBar from "./utility/ProgressBar.svelte";
    import { updateTablistWidth } from "./EditorTabList.svelte";

    export let content = null;

    onMount(() => {
        updateTablistWidth();
    })

    onDestroy(() => {
        updateTablistWidth();
    })
</script>
<div id="sidebarview">
    {#if content}
        <div id="tool-view">
            <svelte:component this={content}></svelte:component>
        </div>
    {/if}
    {#if $treeLoading}
        <div class="loading-container">
            <ProgressBar label="{$dirToLoad}..." fail={$dirLoadFail}></ProgressBar>
        </div>
    {/if}
</div>

<style lang="scss">
    #sidebarview {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .loading-container {
            width: 100%;
            height: 15%;
            justify-self: end;
            background-color: #171717;
            border-top: #414040 1px solid;
            border-left: #414040 1px solid;
            border-bottom: #414040 1px solid;
        }
    }
	#tool-view {
        width: 100%;
        overflow-y: auto;
        overflow-x: hidden;
        height: 100%;
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #4c4c4c38;
        }
        &::-webkit-scrollbar-corner {
            background-color: transparent;
        }
    }
</style>