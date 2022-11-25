<script lang="ts">
    import Menu from "../Menu/Menu.svelte";
    import "../../overrides.css";
	import { filemenu, editmenu, viewmenu, runmenu, helpmenu} from "../Menu/menu";
    import { appWindow } from "@tauri-apps/api/window";
    import { workspacename } from "../FileTree/scripts/TreeStore";
</script>
<div id="header">
    <div id="logo"></div>
    <div id="menubar">
        <Menu name="File" options={filemenu}></Menu>
        <Menu name="Edit" options={editmenu}></Menu>
        <Menu name="View" options={viewmenu}></Menu>
        <Menu name="Run" options={runmenu}></Menu>
        <Menu name="Help" options={helpmenu}></Menu>
    </div>
    <div class="divider"></div>
    <div id="workspace">
        {$workspacename}
    </div>
    <div id="handle" data-tauri-drag-region></div>
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
        height: 2rem;
        align-items: center;
        border-bottom: 1px solid #393939;
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
		background-color: #393939;
		margin: 0 4px;
	}
    #workspace {
        height: 100%;
		width: fit-content;
		max-width: 200px;
		overflow-x: clip;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 1rem;
    }

    #handle {
        position: absolute;
        width: -webkit-fill-available;
        z-index: 9;
    }

    #window-controls {
		margin-left: auto;
		height: 100%;
		display: flex;
		z-index: 9999;
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