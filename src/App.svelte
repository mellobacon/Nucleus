<script lang="ts">
    import Header from "./lib/Header.svelte";
    import Sidebar, { showsidebarview, tool} from "./lib/Sidebar.svelte";
	import { Pane, Splitpanes } from 'svelte-splitpanes';
    import SidebarView from "./lib/SidebarView.svelte";
    import Statusbar from "./lib/Statusbar.svelte";
    import EditorTabList, {hidden, updateTablistWidth} from "./lib/EditorTabList.svelte";
    import { onMount } from "svelte";
	import { appWindow } from '@tauri-apps/api/window';
    import { writable } from "svelte/store";
    import InputModal from "./lib/Modals/InputModal.svelte";
    import RenameModal from "./lib/Modals/RenameModal.svelte";
    import { loadDefaultSettings } from "./config/config";
    import { error } from "tauri-plugin-log-api";
	let resolution = writable(0);

	let minPanelSize = 10;
	let panelSize = 15;

	onMount(async () => {
		await loadDefaultSettings();
		let size = await appWindow.innerSize();
		resolution.set(size.width);
		updateMinPanelSize();

		appWindow.onResized((e) => {
			resolution.set(e.payload.width);
			updateMinPanelSize();
		})

		window.onunhandledrejection = (e) => {
			error(e.reason);
		}
	})

	function updatePanelSize(e) {
		if ($showsidebarview) {
			panelSize = e.detail[0].size
		}
	}

	async function updateMinPanelSize() {

		updateTablistWidth();
		if (!await appWindow.isFocused()) {
			return;
		}
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

		if (panelSize < minPanelSize) {
			panelSize = minPanelSize;
		}
	}
</script>
<script lang="ts" context="module">
	export const _openPopup = writable(false);
	const popupProps = writable({});
	const popup = writable(null);
	export const fullscreen = writable(false);

	export function openInputModal(title: string, description: string, buttons: any[], options = undefined, path = "") {
		popup.set(InputModal);
		popupProps.set({title: title, description: description, buttons: buttons, options: options, open: true, path: path});
		_openPopup.set(true);
	}
	export function openRenameModal(title: string, description: string, buttons: any[], path: string) {
		popup.set(RenameModal);
		popupProps.set({title: title, description: description, buttons: buttons, open: true, path: path});
		_openPopup.set(true);
	}
</script>

<svelte:window on:contextmenu|preventDefault></svelte:window>

{#if !$fullscreen}
	<Header />
{/if}
<div id="_">
	<div id="main" class:fullscreen={$fullscreen}>
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
					<div id="tabview" class:hidden={$hidden}></div>
				</div>
			</Pane>
		</Splitpanes>
	</div>
	<Statusbar />
</div>

{#if $_openPopup}
	<svelte:component this={$popup} {...$popupProps}></svelte:component>
{/if}

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
	#tabview {
		width: -webkit-fill-available;
		margin-left: 0.1rem;
        z-index: 1;
        position: absolute;
    }
	.hidden {
		visibility: hidden;
	}
</style>