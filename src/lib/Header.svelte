<script lang="ts">
    import { appWindow } from "@tauri-apps/api/window";
    import Dropdown from "./utility/Dropdown.svelte";
    import Settings from "carbon-icons-svelte/lib/Settings.svelte";

    const items = [
        {menuname: "File", children: [
            {name: "New File", shortcut: "Ctrl + N", action: () => {console.log("click")}},
            {name: "Open File...", shortcut: "Ctrl + O", action: () => {console.log("click")}},
            {name: "Save File", shortcut: "Ctrl + S", action: () => {console.log("click")}},
            {name: "Save File As...", shortcut: "Ctrl + Shift + S", action: () => {console.log("click")}},
            {name: "Close Tab", shortcut: "", action: () => {console.log("click")}},
        ]},
        {menuname: "Edit", children: [
            {name: "Undo", shortcut: "Ctrl + Z", action: () => {console.log("click")}},
            {name: "Redo", shortcut: "Ctrl + Shift + Z", action: () => {console.log("click")}},
            {name: "Cut", shortcut: "Ctrl + X", action: () => {console.log("click")}},
            {name: "Copy", shortcut: "Ctrl + C", action: () => {console.log("click")}},
            {name: "Paste", shortcut: "Ctrl + V", action: () => {console.log("click")}},
            {name: "Paste From History...", shortcut: "Ctrl + Shift + V", action: () => {console.log("click")}},
            {name: "Delete", shortcut: "Delete", action: () => {console.log("click")}},
            {name: "Find", shortcut: "Ctrl + F", action: () => {console.log("click")}},
            {name: "Replace", shortcut: "Ctrl + H", action: () => {console.log("click")}},
        ]},
        {menuname: "View", children: [
            {name: "Command Pallete", shortcut: "Ctrl + Shift + P", action: () => {console.log("click")}},
            {name: "Zoom In", shortcut: "Ctrl +", action: () => {console.log("click")}},
            {name: "Zoom Out", shortcut: "Ctrl -", action: () => {console.log("click")}},
            {name: "Reset Zoom", shortcut: "", action: () => {console.log("click")}},
            {name: "Fullscreen", shortcut: "F11", action: () => {console.log("click")}},
        ]},
        {menuname: "Run", children: [
            {name: "Run File", shortcut: "F5", action: () => {console.log("click")}},
            {name: "Debug File", shortcut: "Ctrl + F5", action: () => {console.log("click")}},
            {name: "Stop File", shortcut: "Shift + F5", action: () => {console.log("click")}},
            {name: "Open Configurations", shortcut: "", action: () => {console.log("click")}},
        ]},
        {menuname: "Window", children: [
            {name: "New Window", shortcut: "Ctrl + Shift + N", action: () => {console.log("click")}},
            {name: "Minimize Window", shortcut: "", action: () => {console.log("click")}},
            {name: "Maximize Window", shortcut: "", action: () => {console.log("click")}},
            {name: "Close Window", shortcut: "Alt + F4", action: () => {console.log("click")}},
        ]},
        {menuname: "Help", children: [
            {name: "Send Feedback", shortcut: "", action: () => {console.log("click")}},
            {name: "Contact Support", shortcut: "", action: () => {console.log("click")}},
            {name: "Report Issue", shortcut: "", action: () => {console.log("click")}},
            {name: "Documentation", shortcut: "", action: () => {console.log("click")}},
            {name: "Show Release Notes", shortcut: "", action: () => {console.log("click")}},
            {name: "Check for Updates", shortcut: "", action: () => {console.log("click")}},
            {name: "About", shortcut: "", action: () => {console.log("click")}},
            {name: "Toggle Developer Tools", shortcut: "", action: () => {console.log("click")}},
        ]},
    ];
</script>
<div id="header">
    <div id="logo"></div>
    <div id="menubar">
        {#each items as item}
            <Dropdown menu={item}></Dropdown>
        {/each}
    </div>
    <div class="divider"></div>
    <div id="workspace">
        Nucleus
    </div>
    <div id="handle" data-tauri-drag-region></div>
    <div class="tools">
        
        <div class="settings">
            <Dropdown menu={{icon: Settings, children: [{name: "Settings", shortcut: "", action: () => {console.log("click")}}, {name: "Keymap", shortcut: "", action: () => {console.log("click")}}]}} />
        </div>
    </div>
    <div id="window-controls">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="window-button"
            id="minimize"
            on:click={() => appWindow.minimize()}
        />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="window-button"
            id="maximize"
            on:click={async () => { (await appWindow.isMaximized()) ? appWindow.unmaximize() : appWindow.maximize(); }}
        />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="window-button"
            id="close"
            on:click={async () => await appWindow.close()}
        />
    </div>
</div>

<style lang="scss">
    #header {
        width: 100%;
        display: flex;
        align-items: center;
    }
    #logo {
        background-size: 20px;
        background-repeat: no-repeat;
        height: 100%;
        min-width: 35px;
        position: relative;
        content: '';
        background-image: url("/assets/images/Icon\(1\).png");
        background-position: center;
        z-index: 10;
    }
    #menubar {
        height: 100%;
        display: flex;
        z-index: 10;
    }
    .divider {
		width: 0.0625rem;
		height: 1.2rem;
		margin: 0 4px;
	}
    #workspace {
        height: 100%;
		width: fit-content;
		max-width: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0.5rem;
        font-size: 14px;
        color: #8c8c8c;
    }

    #handle {
        position: absolute;
        width: -webkit-fill-available;
        z-index: 9;
    }

    .settings {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }
    .tools {
        width: -webkit-fill-available;
        display: flex;
        justify-content: end;
        padding: 0 5px;
        height: 100%;
    }

    #window-controls {
		margin-left: auto;
		height: 100%;
		display: flex;
		z-index: 10;
		.window-button {
			min-width: 36px;
			height: 100%;
			line-height: 34px;
			text-align: center;
			padding: 0 5px;
			font-size: 14px;
			color: white;
			cursor: pointer;
			&:not(#close):hover {
				background-color: #262626;
			}
			&#close:hover {
				background-color: #ff3131;
			}
			&#minimize::before {
				content: "\2014";
				font-size: 10px;
			}
			&#maximize::before {
				content: "\eabb"; // replace
			}
			&#close::before {
				content: "\2715";
				line-height: 30px;
			}
		}
	}
    
</style>