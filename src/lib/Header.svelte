<script lang="ts">
    import Dropdown from "./utility/Dropdown.svelte";
    import settings from "./Settings.svelte";
    import { Settings } from "carbon-icons-svelte";
    import { addTab, tabs, closeActiveTab } from "../lib/EditorTabList.svelte";
    import { workspaceName } from "./File";
    import { commands } from "../config/commands";
    import { shell } from "@tauri-apps/api";
    import { openLogFiles } from "../config/config";

    const items = [
        {menuname: "File", children: [
            {name: "New File", shortcut: commands.addEditorTab.keybind, action: commands.addEditorTab.command},
            {name: "Open File...", shortcut: commands.openFile.keybind, action: commands.openFile.command},
            {name: "Open Folder...", shortcut: commands.openFolder.keybind, action: commands.openFolder.command},
            {name: "Save File", shortcut: commands.saveFile.keybind, action: commands.saveFile.command},
            {name: "Save File As...", shortcut: commands.saveFileAs.keybind, action: commands.saveFileAs.command},
            {name: "Close Tab", disabled: $tabs.length === 0, shortcut: "", action: async () => {await closeActiveTab()}},
        ]},
        {menuname: "Edit", children: [
            {name: "Undo", disabled: commands.undo.disabled, shortcut: commands.undo.keybind, action: commands.undo.command},
            {name: "Redo", disabled: commands.redo.disabled, shortcut: commands.redo.keybind, action: commands.redo.command},
            {name: "Cut", disabled: commands.cut.disabled, shortcut: commands.cut.keybind, action: commands.cut.command},
            {name: "Copy", disabled: commands.copy.disabled, shortcut: commands.copy.keybind, action: commands.copy.command},
            {name: "Paste", disabled: commands.paste.disabled, shortcut: commands.paste.keybind, action: commands.paste.command},
            {name: "Paste From History...", disabled: true, shortcut: commands.pasteFromHistory.keybind, action: commands.pasteFromHistory.command},
            {name: "Delete", disabled: commands.delete.disabled, shortcut: commands.delete.keybind, action: commands.delete.command},
            {name: "Find",  disabled: true,  shortcut: commands.find.keybind, action: () => commands.find.command},
            {name: "Replace", disabled: true,  shortcut: commands.replace.keybind, action: commands.replace.command},
        ]},
        {menuname: "View", children: [
            {name: "Command Pallete", disabled: true, shortcut: commands.openCommandPallete.keybind, action: commands.openCommandPallete.command},
            {name: "Zoom In", disabled: true, shortcut: commands.zoomIn.keybind, action: commands.zoomIn.command},
            {name: "Zoom Out", disabled: true, shortcut: commands.zoomOut.keybind, action: commands.zoomOut.command},
            {name: "Reset Zoom", disabled: true, shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Fullscreen", disabled: commands.fullscreen.disabled, shortcut: commands.fullscreen.keybind, action: commands.fullscreen.command},
        ]},
        {menuname: "Run", children: [
            {name: "Run File", disabled: true,  shortcut: commands.runFile.keybind, action: commands.runFile.command},
            {name: "Debug File", disabled: true,  shortcut: commands.debugFile.keybind, action: commands.debugFile.command},
            {name: "Stop File", disabled: true,  shortcut: commands.stopFile.keybind, action: commands.stopFile.command},
            {name: "Open Configurations", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
        ]},
        {menuname: "Window", children: [
            {name: "New Window", disabled: true,  shortcut: commands.openNewWindow.keybind, action: commands.openNewWindow.command},
            {name: "Minimize Window", shortcut: commands.minimizeWindow.keybind, action: commands.minimizeWindow.command},
            {name: "Maximize Window", shortcut: commands.maximizeWindow.keybind, action: commands.maximizeWindow.command},
            {name: "Close Window", shortcut: commands.closeWindow.keybind, action: commands.closeWindow.command},
        ]},
        {menuname: "Help", children: [
            {name: "Send Feedback", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Contact Support", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Report Issue", shortcut: "", action: () => {shell.open("https://github.com/mellobacon/Nucleus/issues/new/choose")}},
            {name: "Documentation", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Show Release Notes", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "Check for Updates", disabled: true,  shortcut: "", action: () => {console.warn("Feature not implemented yet.")}},
            {name: "About", shortcut: "", action: () => {shell.open("https://github.com/mellobacon/Nucleus")}},
            {name: "Open Logs", shortcut: "", action: async () => {await openLogFiles()}},
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
        
        <div class="settings-button">
            <Dropdown right menu={{icon: Settings, children: [
                {name: "Settings", shortcut: "", action: () => {addTab("Settings", "Settings", new settings({target: document.getElementById("tabview")}))}}, 
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
            on:click={commands.minimizeWindow.command}
        />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="window-button"
            id="maximize"
            on:click={commands.maximizeWindow.command}
        />
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
            class="window-button"
            id="close"
            on:click={commands.closeWindow.command}
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

    .settings-button {
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