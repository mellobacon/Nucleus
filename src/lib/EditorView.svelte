<script>
    import EditorTabs from "./components/Tabs/EditorTabs.svelte";
    export let hidden = false;
</script>
<div id="editor-view" class:hidden>
    <EditorTabs />
    <div id="tab-view"></div>
</div>

<style lang="scss">
    #editor-view {
		height: 100%;
        overflow: hidden;
        &.hidden {
            display: none;
        }
	}
    #tab-view {
		width: 100%;
        z-index: 1;
        height: calc(100% - 2.3rem);
    }
</style>