<script lang="ts">
	import Header from "./components/Header/Header.svelte";
	import Sidebar from "./components/Sidebar/Sidebar.svelte";
	import MainView from "./components/View/MainView.svelte";
	import "carbon-components-svelte/css/g100.css";
	import { Pane, Splitpanes } from 'svelte-splitpanes';
    import SidebarView from "./components/Sidebar/SidebarView.svelte";
    import { showsidebarview, tool } from "./components/Sidebar/Sidebar";
	import settings from "./config/nucleus-settings.json";
    import { executeWindowShortcut } from "./config/config";
    import { Action, addNotification, NotifType } from "./components/Notifications/Notifications";
    import { onMount } from "svelte";
    import { shell } from "@tauri-apps/api";

	const shortcuts = Object.entries(settings.shortcuts);
	let keys = {};
	function modifier(shortcut) {
        switch (shortcut) {
            case "Ctrl":
                return "Control";
            case "Shift":
                return "Shift";
            case "Alt":
                return "Alt";
        }
        return "";
    }

    onMount(() => {
        addNotification(NotifType.Message, "Nucleus editor is in a work in progress state. Expect missing features and bugs", [new Action("GitHub link", () => {shell.open("https://github.com/mellobacon/Nucleus")}), new Action("Report issue/feature", () => {shell.open("https://github.com/mellobacon/Nucleus/issues/new/choose")})]);
    })
</script>

<svelte:window on:contextmenu|preventDefault on:keyup={(e) => {
    const key = e.key.charAt(0).toUpperCase() + e.key.slice(1);
    keys[key] = false;
    keys = {};
}}
on:keydown={async (e) => {
    const key = e.key.charAt(0).toUpperCase() + e.key.slice(1);
    keys[key] = true;
    for (const [name, shortcutKey] of shortcuts) {
        if (keys[modifier(shortcutKey.modifier)] && keys[modifier(shortcutKey.secondaryKey)] && keys[shortcutKey.primaryKey]) {
            await executeWindowShortcut(name);
            return false;
        }
        else if (keys[modifier(shortcutKey.modifier)] && shortcutKey.secondaryKey === "" && keys[shortcutKey.primaryKey]) {
            await executeWindowShortcut(name);
            return false;
        }
        else if (shortcutKey.modifier === "" && shortcutKey.secondaryKey === "" && keys[shortcutKey.primaryKey]) {
            e.preventDefault();
            await executeWindowShortcut(name);
            break;
        }
    }
}}></svelte:window>

<Header />
<div id="main">
	<Sidebar />
	<Splitpanes theme="editor-pane">
		{#if $showsidebarview}
		<Pane size={25} minSize={10} maxSize={60}>
			<SidebarView title={$tool.tabname} content={$tool.content}></SidebarView>
		</Pane>
		{/if}
		<Pane>
			<MainView />
		</Pane>
	</Splitpanes>
</div>
<style>
	#main {
		display: flex;
	}
</style>