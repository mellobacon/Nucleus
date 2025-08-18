<script lang="ts">
    import { onMount } from "svelte";
    import Titlebar from "./lib/Titlebar.svelte";
    import { loadSettings } from "./config/config";
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import Statusbar from "./lib/Statusbar.svelte";
    import WindowPane from "./lib/components/WindowPane.svelte";
    import EditorBackground from "./lib/EditorBackground.svelte";
    import EditorView from "./lib/EditorView.svelte";
    import { terminalInstance } from "./lib/components/Terminal.svelte";
    import { writable, get } from "svelte/store";
    import ContextMenu from "./lib/components/ContextMenu.svelte";
    import { activeMenu } from "./scripts/Menu";
    import { paneLeft, paneBottom, paneRight, paneLeftSize, paneBottomSize, paneRightSize } from "./config/configStore";
    import { editorTabsEmpty } from "./lib/components/Tabs/EditorTabs.svelte";
    import { bottomPanel, initPanels, leftPanel, rightPanel } from "./scripts/panel";
    import CommandPalette from "./lib/components/CommandPalette.svelte";
    import { Commands } from "./config/commands";

    onMount(async () => {
        await loadSettings();
        initPanels();
        document.addEventListener("click", handleMenuClickOutside);
    });

    function handleMenuClickOutside(event: MouseEvent) {
        const e = event.target as HTMLElement;
        let button = e;
        if (e.parentElement && e.parentElement.nodeName === "BUTTON")  {
            button = e.parentElement;
        }
        if (!button.classList.contains("menu-button")) {
            activeMenu.set(null)
        }
    }

    function adjustTerminalPanel() {
        if (!$terminalInstance) return;
        $terminalInstance.fitTerminal()
    }

    function setSidePanelSize(e) {
        if (!$paneLeft || !$paneRight) return;
        paneLeftSize.set(e.detail[0].size)
        if (e.detail[2]) {
            paneRightSize.set(e.detail[2].size)
        }
    }
    function setPanelBottomSize(e) {
        if (e.detail.length === 1) return;
        paneBottomSize.set(e.detail[1].size)
    }
</script>

<script lang="ts" context="module">
    export let contextMenu = writable({open: false, target: null, items: []});
    export let commandPallete = writable<CommandPalette>();

    export function openCommandPallete(title = "Command Palette", placeholder = "Type a command...", list = Commands.getNamedCommands(), filterInput = true) {
        let cmdPallete = get(commandPallete);
        if (!cmdPallete) {
            cmdPallete = new CommandPalette({target: document.getElementById("main")});
            commandPallete.set(cmdPallete);
        }
        if (cmdPallete.title === title) {
            cmdPallete.open = true;
            return;
        }
        cmdPallete.$set({"title": title, placeholder: placeholder, list: list, open: true, filterInput: filterInput});
    }
</script>

<svelte:window on:contextmenu|preventDefault></svelte:window>

<Titlebar showMenubar tools layout />
<div id="main">
    <Splitpanes on:resized={setSidePanelSize} dblClickSplitter={false} theme="editor-panes" on:pane-remove={adjustTerminalPanel} on:pane-add={adjustTerminalPanel} on:resize={adjustTerminalPanel}>
        {#if $paneLeft}
            <Pane size={$paneLeftSize}>
                <WindowPane 
                    title={$leftPanel.title} 
                    menu={$leftPanel.menu}
                    content={$leftPanel.content} 
                    ellipsis={$leftPanel.ellipsis} 
                    bottom={$leftPanel.bottom}
                    bottomTooltip={$leftPanel.bottomTooltip}
                    tools={$leftPanel.tools ?? []}
                ></WindowPane>
            </Pane>
        {/if}
        <Pane>
            <Splitpanes on:resized={setPanelBottomSize} dblClickSplitter={false} theme="editor-panes" horizontal on:pane-remove={adjustTerminalPanel} on:pane-add={adjustTerminalPanel} on:resize={adjustTerminalPanel}>
                <Pane>
                    <EditorBackground hidden={!$editorTabsEmpty} />
                    <EditorView hidden={$editorTabsEmpty} />
                </Pane>
                {#if $paneBottom}
                    <Pane size={$paneBottomSize}>
                        <WindowPane 
                            title={$bottomPanel.title} 
                            menu={$bottomPanel.menu}
                            content={$bottomPanel.content} 
                            ellipsis={$bottomPanel.ellipsis} 
                            bottom={$bottomPanel.bottom}
                            bottomTooltip={$bottomPanel.bottomTooltip}
                            tools={$bottomPanel.tools ?? []}
                        />
                    </Pane>
                {/if}
            </Splitpanes>
        </Pane>
        {#if $paneRight}
            <Pane size={$paneRightSize}>
                <WindowPane
                    title={$rightPanel.title} 
                    menu={$rightPanel.menu}
                    content={$rightPanel.content} 
                    ellipsis={$rightPanel.ellipsis} 
                    bottom={$rightPanel.bottom}
                    bottomTooltip={$rightPanel.bottomTooltip}
                    tools={$rightPanel.tools ?? []}
                ></WindowPane>
            </Pane>
        {/if}
    </Splitpanes>
</div>
<Statusbar />

<ContextMenu target={$contextMenu.target} items={$contextMenu.items} menuOpen={$contextMenu.open} />