<script lang="ts">
    import Header from "./lib/Header.svelte";
    import Sidebar, { showsidebarview, tool} from "./lib/Sidebar.svelte";
	import { Pane, Splitpanes } from 'svelte-splitpanes';
    import SidebarView from "./lib/SidebarView.svelte";
    import Statusbar from "./lib/Statusbar.svelte";
    import EditorTabList from "./lib/EditorTabList.svelte";
    import { onMount } from "svelte";
    import { loadTheme } from "./config/themehandler";
	import { appWindow } from '@tauri-apps/api/window';
    import { writable } from "svelte/store";
	let resolution = writable(0);

	let minPanelSize = 10;
	let panelSize = 15;

	onMount(async () => {
		await loadTheme("dark");

		let size = await appWindow.innerSize();
		resolution.set(size.width);
		updateMinPanelSize();

		appWindow.onResized((e) => {
			resolution.set(e.payload.width);
			updateMinPanelSize();
			if (panelSize < minPanelSize) {
				panelSize = minPanelSize;
			}
		})
	})

	function updatePanelSize(e) {
		if ($showsidebarview) {
			panelSize = e.detail[0].size
		}
	}

	function updateMinPanelSize() {
		// TODO: make this better
		if ($resolution <= 700) {
			minPanelSize = 30;
		}
		else if ($resolution <= 1040) {
			minPanelSize = 20;
		}
		else if ($resolution <= 1120) {
			minPanelSize = 17;
		}
		else if ($resolution <= 1300) {
			minPanelSize = 14;
		}
		else if ($resolution > 1300) {
			minPanelSize = 10;
		}
	}
</script>

<Header />
<div id="main">
	<Sidebar />
	<Splitpanes on:resized={updatePanelSize} on:resize={updateMinPanelSize} theme="editor-panes">
		{#if $showsidebarview}
			<Pane bind:size={panelSize} bind:minSize={minPanelSize} maxSize={60}>
				<SidebarView content={$tool.content}></SidebarView>
			</Pane>
		{/if}
		<Pane>
			<div id="container">
				<EditorTabList />
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
		background-image: url("/assets/images/Watermark(3).png");
        background-repeat: no-repeat;
        background-position: center;
	}
</style>