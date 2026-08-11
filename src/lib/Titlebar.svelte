<script lang="ts">
    import { Commands } from "../config/commands";
    import { Menu as MenuClass } from "../scripts/Menu";
    import Menu from "./components/Menu.svelte";
    import FoldersList from "../assets/icons/folders_list.svelte";
    import { tooltip } from "../scripts/tooltip";
    import Settings from "../assets/icons/settings.svelte";
    import Panel_Left from "../assets/icons/panel_left.svelte";
    import Panel_Right from "../assets/icons/panel_right.svelte";
    import Panel_Bottom from "../assets/icons/panel_bottom.svelte";
    import Panel_Left_Open from "../assets/icons/panel_left_open.svelte";
    import Panel_Right_Open from "../assets/icons/panel_right_open.svelte";
    import Panel_Bottom_Open from "../assets/icons/panel_bottom_open.svelte";
    import Wand from "../assets/icons/wand.svelte";
    import Extensions from "../assets/icons/extensions.svelte";
    import Cmd from "../assets/icons/cmd.svelte";
    import { paneBottom, paneLeft, paneRight, toggleBottomPanel, toggleLeftPanel, toggleRightPanel } from "../config/configStore";
    import Hamburger from "../assets/icons/hamburger.svelte";
    import Close from "../assets/icons/close.svelte";
    import Maximize from "../assets/icons/maximize.svelte";
    import Minimize from "../assets/icons/minimize.svelte";
    import { openPanel, PanelDirection } from "../scripts/panel";
    
    let items = new MenuClass().getItems();

    export let showMenubar = false;
    export let tools = false;
    export let layout = false;
    export let windowTitle = "Window";
    let menubar: HTMLElement;
    
    let directoryName = "<No Directory>";
</script>

<div id="titlebar" data-tauri-drag-region>
    {#if showMenubar}
        <div id="menubar" class="nav-collapse" bind:this={menubar}>
            {#each items as item}
                <Menu menu={item} activateOnHover></Menu>
            {/each}
        </div>
        <div id="menubar" class="nav-toggle">
            <Menu menu={{icon: Hamburger, children: items.map(m => {
                return {name: m.menu, children: m.children, action: null}
            })}}></Menu>
        </div>

        <div class="divider"></div>
    {/if}

    {#if tools}
        <div class="tools">
            <div class="tool" title="File Tree" use:tooltip on:click={() => openPanel("File Explorer", PanelDirection.Left)}>
                <svelte:component this={FoldersList}></svelte:component>
            </div>
            <div class="tool" title="Terminal" use:tooltip on:click={() => openPanel("Terminal", PanelDirection.Bottom)}>
                <svelte:component this={Cmd}></svelte:component>
            </div>
        </div>

        <div id="center" data-tauri-drag-region>
            {directoryName}
        </div>

        {#if layout}
        <div class="tools">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="tool" title="Toggle Left Panel" use:tooltip on:click={toggleLeftPanel}>
                {#if $paneLeft}
                <svelte:component this={Panel_Left}></svelte:component>
                {:else}
                <svelte:component this={Panel_Left_Open}></svelte:component>
                {/if}
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="tool" title="Toggle Bottom Panel" use:tooltip on:click={toggleBottomPanel}>
                {#if $paneBottom}
                <svelte:component this={Panel_Bottom}></svelte:component>
                {:else}
                <svelte:component this={Panel_Bottom_Open}></svelte:component>
                {/if}
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="tool" title="Toggle Right Panel" use:tooltip on:click={toggleRightPanel}>
                {#if $paneRight}
                <svelte:component this={Panel_Right}></svelte:component>
                {:else}
                <svelte:component this={Panel_Right_Open}></svelte:component>
                {/if}
            </div>
        </div>
        <div class="divider"></div>
        {/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="tools">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="tool" title="Settings" use:tooltip on:click={Commands.commands.openSettings.command}>
                <svelte:component this={Settings}></svelte:component>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="tool" title="Extensions" use:tooltip>
                <svelte:component this={Extensions}></svelte:component>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="tool" title="Check For Updates" use:tooltip>
                <svelte:component this={Wand}></svelte:component>
            </div>
        </div>

        <div class="divider"></div>
    {:else}
        <div id="center" class="title" data-tauri-drag-region>
            {windowTitle}
        </div>
    {/if}

    <div id="window-controls">
        <button aria-label="button" class="window-button" id="minimize" on:click={Commands.commands.minimizeWindow.command}>
            <Minimize />
        </button>
        <button aria-label="button" class="window-button" id="maximize" on:click={Commands.commands.maximizeWindow.command}>
            <Maximize />
        </button>
        <button aria-label="button" class="window-button" id="close" on:click={Commands.commands.closeWindow.command}>
            <Close />
        </button>
    </div>
</div>

<style lang="scss">
    button {
        all: unset;
    }
    #titlebar {
        width: 100%;
        display: flex;
        align-items: center;
        position: relative;
    }
    #menubar {
        height: 100%;
        display: flex;
    }
    .divider {
		width: 0.0625rem;
        min-width: 0.0625rem;
		height: 1.2rem;
		margin: 0 4px;
	}
    #center {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        font-size: 0.9rem;
    }
    #center.title {
        padding-left: 120px;
    }
    .tools {
        display: flex;
        align-items: center;
        height: 100%;
        padding: 0 5px;
        .tool {
            height: 100%;
            padding: 0 8px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            :global(svg) {
                width: 20px;
                height: 20px;
            }
        }
    }
    #window-controls {
		height: 100%;
		display: flex;
		z-index: 1000;
        margin-left: auto;
		button {
			min-width: 36px;
			height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
			padding: 0 5px;
			font-size: 0.875rem;
			cursor: pointer;
			&#close:hover {
				background-color: #ff3131;
			}
			&#close, #maximize, #minimize {
				:global(svg) {
                    height: 16px;
                    width: 16px;
                }
			}
		}
	}
</style>