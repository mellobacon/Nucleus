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
    import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
    import Cmd from "../assets/icons/cmd.svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import { toggleInputModal } from "./components/Modal.svelte";
    import { paneBottom, paneLeft, paneRight, toggleBottomPanel, toggleLeftPanel, toggleRightPanel } from "../config/configStore";
    import Hamburger from "../assets/icons/hamburger.svelte";
    
    let items = new MenuClass().getItems();

    export let showMenubar = false;
    export let tools = false;
    export let layout = false;
    export let windowTitle = "Window";
    let menubar: HTMLElement;
    
    let app = getCurrentWindow();
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
            <div class="tool" title="File Tree" use:tooltip>
                <svelte:component this={FoldersList}></svelte:component>
            </div>
            <div class="tool" title="Terminal" use:tooltip>
                <svelte:component this={Cmd}></svelte:component>
            </div>
        </div>

        <div id="center" data-tauri-drag-region>
            FakeDir
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
            <div class="tool" title="Settings" use:tooltip>
                <svelte:component this={Settings}></svelte:component>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="tool" title="Extensions" use:tooltip on:click={async () => {
                let webview = new WebviewWindow("overlay", {
                    url: "../../overlay.html",
                    decorations: false,
                    title: "Extensions",
                    width: 600,
                    height: 200,
                    center: true,
                    skipTaskbar: true,
                    resizable: false,
                    parent: app
                })
                
                webview.once('tauri://created', async function (e) {
                    console.log(e)
                });
                webview.once('tauri://error', function (e) {
                    console.log(e)
                });
            }}>
                <svelte:component this={Extensions}></svelte:component>
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="tool" title="Check For Updates" use:tooltip on:click={() => {
                toggleInputModal("Input Modal", "pretend description here");
            }}>
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
        <button aria-label="button" class="window-button" id="minimize" on:click={Commands.commands.minimizeWindow.command}></button>
        <button aria-label="button" class="window-button" id="maximize" on:click={Commands.commands.maximizeWindow.command}></button>
        <button aria-label="button" class="window-button" id="close" on:click={Commands.commands.closeWindow.command}></button>
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
		height: 1.2rem;
		margin: 0 4px;
	}
    #center {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
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
			line-height: 34px;
			text-align: center;
			padding: 0 5px;
			font-size: 0.875rem;
			cursor: pointer;
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