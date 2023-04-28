<script lang="ts">
    import Header from "./lib/Header.svelte";
    import Sidebar, { showsidebarview, tool} from "./lib/Sidebar.svelte";
	import { Pane, Splitpanes } from 'svelte-splitpanes';
    import SidebarView from "./lib/SidebarView.svelte";
    import Statusbar from "./lib/Statusbar.svelte";
    import EditorTabList from "./lib/EditorTabList.svelte";
    import { onMount } from "svelte";
    import { loadTheme } from "./config/themehandler";

	onMount(async () => {
		await loadTheme("dark");
	})
</script>

<Header />
<div id="main">
	<Sidebar />
	<Splitpanes theme="editor-panes">
		{#if $showsidebarview}
			<Pane size={25} minSize={10} maxSize={60}>
				<SidebarView content={$tool.content}></SidebarView>
			</Pane>
		{/if}
		<Pane>
			<div id="container">
				<div id="editor-view">
					<EditorTabList />
				</div>
			</div>
		</Pane>
	</Splitpanes>
</div>
<Statusbar />
<style lang="scss">
	#main {
		display: flex;
	}
	#container {
		height: 100%;
        overflow: hidden;
	}
	#editor-view {
		background-image: url("/assets/images/Watermark(3).png");
        background-repeat: no-repeat;
        background-position: center;
        position: relative;
		height: 100%;
	}
</style>