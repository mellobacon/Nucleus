<script lang="ts">
    import Header from "./lib/Header.svelte";
    import Sidebar, { showsidebarview, tool} from "./lib/Sidebar.svelte";
	import { Pane, Splitpanes } from 'svelte-splitpanes';
    import SidebarView from "./lib/SidebarView.svelte";
    import Statusbar, { showBottomPanel, editortool } from "./lib/Statusbar.svelte";
    import EditorTabList, {hidden, updateTablistWidth} from "./lib/EditorTabList.svelte";
    import { onMount } from "svelte";
	import { appWindow } from '@tauri-apps/api/window';
    import { writable } from "svelte/store";
    import InputModal from "./lib/Modals/InputModal.svelte";
    import RenameModal from "./lib/Modals/RenameModal.svelte";
    import { loadDefaultSettings } from "./config/config";
    import { error } from "tauri-plugin-log-api";
    import ToolView from "./lib/ToolView.svelte";
    import { getExtensions } from "./config/extensionhandler";
    import { fitTerminal } from "./lib/Terminal.svelte";
    import { loadDir } from "./lib/File";
    import NotificationToasts from "./lib/Notifications/NotificationToasts.svelte";
    import { NotifType, addNotification, toasts } from "./lib/Notifications/notifications";
	import { shell } from "@tauri-apps/api";
	let resolution = writable(0);

	let minPanelSize = 10;
	let panelSize = 15;
	let bottomPanelSize = 20;

	onMount(async () => {
		await getExtensions();
		await loadDefaultSettings();
		let dir = localStorage.getItem("lastDir");
		if (dir) {
			loadDir(dir);
		}

		let size = await appWindow.innerSize();
		resolution.set(size.width);
		updateMinPanelSize();

		addNotification(NotifType.Message, "Welcome to Nucleus", [
			{label: "Learn More", action: () => {shell.open("https://github.com/mellobacon/Nucleus")}}, 
			{label: "Create Issue", action: () => {shell.open("https://github.com/mellobacon/Nucleus/issues/new/choose")}}
		], "Nucleus is in alpha. If there are any bugs present or features you want to add, create an issue below.");

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
		fitTerminal();
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

	type Button = {
		name: string, 
		action, 
		disabled?: boolean, 
		style?: "primary" | "secondary" | "accent" | "danger",
		type?: "button" | "submit" | "reset",
		cancel?: boolean
	}

	export function openInputModal(title: string, description: string, buttons: Button[], options = undefined, path = "") {
		popup.set(InputModal);
		popupProps.set({title: title, description: description, buttons: buttons, options: options, open: true, path: path});
		_openPopup.set(true);
	}
	export function openRenameModal(title: string, description: string, buttons: Button[], path: string) {
		popup.set(RenameModal);
		popupProps.set({title: title, description: description, buttons: buttons, open: true, path: path});
		_openPopup.set(true);
	}
</script>

<svelte:window on:contextmenu|preventDefault></svelte:window>

<div id="_" inert={$_openPopup}>
	{#if !$fullscreen}
		<Header />
	{/if}
	<div id="main" class:fullscreen={$fullscreen}>
		<Sidebar />
		<Splitpanes on:resized={updatePanelSize} on:resize={updateMinPanelSize} theme="editor-panes">
			{#if $showsidebarview}
				<Pane bind:size={panelSize} bind:minSize={minPanelSize} maxSize={60}>
					<SidebarView content={$tool.content}></SidebarView>
				</Pane>
			{/if}
			<Pane>
				<div class="__">
					<Splitpanes horizontal theme="editor-panes" on:resize={fitTerminal} class="{!$showBottomPanel ? "hidden" : ""}">
						<Pane size={$showBottomPanel ? 100 - bottomPanelSize : 100}>
							<div id="container">
								<EditorTabList />
								<div id="tabview" class:hidden={$hidden}></div>
							</div>
						</Pane>
						{#if $editortool}
						<Pane bind:size={bottomPanelSize} maxSize={90} minSize={10} class="view-bottom-pane">
							<ToolView name={$editortool.name} options={$editortool.options} buttons={$editortool.buttons}></ToolView>
						</Pane>
						{/if}
					</Splitpanes>
				</div>
			</Pane>
		</Splitpanes>
	</div>
	<Statusbar />
	{#if $toasts.length != 0}
		<NotificationToasts />
	{/if}
</div>

{#if $_openPopup}
	<svelte:component this={$popup} {...$popupProps}></svelte:component>
{/if}

<style lang="scss">
	.__ {
		height: 100%;
        overflow: hidden;
		:global(.hidden) {
			:global(.splitpanes__splitter), :global(.view-bottom-pane) {
				display: none;
			}
		}
	}
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
        z-index: 1;
    }
	.hidden {
		visibility: hidden;
	}
	:global(.view-bottom-pane) {
		z-index: 1;
	}
</style>
