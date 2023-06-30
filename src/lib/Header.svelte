<script lang="ts">
    import { appWindow } from "@tauri-apps/api/window";
    import Dropdown from "./utility/Dropdown.svelte";
    import Settings from "carbon-icons-svelte/lib/Settings.svelte";
    import { addTab, addEditorTab, tabs, closeActiveTab } from "../lib/EditorTabList.svelte";
    import { saveFile, openFile, openFolder, workspaceName } from "./File";

    const items = [
        {menuname: "File", children: [
            {name: "New File", shortcut: "Ctrl + N", action: () => {addEditorTab()}},
            {name: "Open File...", shortcut: "Ctrl + O", action: async () => {await openFile()}},
            {name: "Open Folder...", shortcut: "Ctrl + K", action: async () => {await openFolder()}},
            {name: "Save File", shortcut: "Ctrl + S", action: async () => {await saveFile()}},
            {name: "Save File As...", shortcut: "Ctrl + Shift + S", action: async () => {await saveFile(true)}},
            {name: "Close Tab", disabled: $tabs.length === 0, shortcut: "", action: async () => {await closeActiveTab()}},
        ]},
        {menuname: "Edit", children: [
            {name: "Undo", shortcut: "Ctrl + Z", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Redo", shortcut: "Ctrl + Shift + Z", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Cut", shortcut: "Ctrl + X", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Copy", shortcut: "Ctrl + C", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Paste", shortcut: "Ctrl + V", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Paste From History...", disabled: true, shortcut: "Ctrl + Shift + V", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Delete", shortcut: "Delete", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Find", disabled: true,  shortcut: "Ctrl + F", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Replace", disabled: true,  shortcut: "Ctrl + H", action: () => {console.warn("Feature not implemented yet.")}},
        ]},
        {menuname: "View", children: [
            {name: "Command Pallete", disabled: true,  shortcut: "Ctrl + Shift + P", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Zoom In", shortcut: "Ctrl +", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Zoom Out", shortcut: "Ctrl -", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Reset Zoom", shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Fullscreen", shortcut: "F11", action: () => {console.warn("Feature not implemented yet.")}},
        ]},
        {menuname: "Run", children: [
            {name: "Run File", disabled: true,  shortcut: "F5", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Debug File", disabled: true,  shortcut: "Ctrl + F5", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Stop File", disabled: true,  shortcut: "Shift + F5", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Open Configurations", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        ]},
        {menuname: "Window", children: [
            {name: "New Window", disabled: true,  shortcut: "Ctrl + Shift + N", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Minimize Window", shortcut: "", action: async () => {await appWindow.minimize()}},
            {name: "Maximize Window", shortcut: "", action: async () => {await appWindow.maximize()}},
            {name: "Close Window", shortcut: "Alt + F4", action: async () => {await appWindow.close()}},
        ]},
        {menuname: "Help", children: [
            {name: "Send Feedback", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Contact Support", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Report Issue", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Documentation", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Show Release Notes", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Check for Updates", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "About", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
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
    <div id="workspace" title="" data-tauri-drag-region>
        {$workspaceName}
    </div>
    <div id="handle" data-tauri-drag-region></div>
    <div class="tools">
        
        <div class="settings">
            <Dropdown right menu={{icon: Settings, children: [
                {name: "Settings", disabled: true, shortcut: "", action: () => {addTab("Settings", "Settings")}}, 
                {name: "Keymap", disabled: true, shortcut: "", action: () => {console.warn("Feature not implemented yet.")}}
            ]
            }} />
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
        position: relative;
        z-index: 3;
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
		padding: 0 0.5rem;
        font-size: 0.813rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #8c8c8c;
        z-index: 10;
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
        display: flex;
        justify-content: end;
        padding: 0 5px;
        height: 100%;
        margin-left: auto;
    }

    #window-controls {
		height: 100%;
		display: flex;
		z-index: 10;
		.window-button {
			min-width: 36px;
			height: 100%;
			line-height: 34px;
			text-align: center;
			padding: 0 5px;
			font-size: 0.875rem;
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
				content: "\2610";
			}
			&#close::before {
				content: "\2715";
				line-height: 30px;
			}
		}
	}
    
</style>