<script lang="ts">
    import { onMount } from "svelte";
    import Titlebar from "./lib/Titlebar.svelte";
    import { loadSettings } from "./config/config";
    import { Pane, Splitpanes } from 'svelte-splitpanes';
    import Statusbar from "./lib/Statusbar.svelte";
    import FileTree from "./lib/components/FileTree.svelte";
    import AddFile from "./assets/icons/add_file.svelte";
    import AddFolder from "./assets/icons/add_folder.svelte";
    import CollapseAll from "./assets/icons/collapse_all.svelte";
    import Refresh from "./assets/icons/refresh.svelte";
    import Notifications from "./lib/Notifications.svelte";
    import WindowPane from "./lib/components/WindowPane.svelte";
    import EditorBackground from "./lib/EditorBackground.svelte";
    import EditorView from "./lib/EditorView.svelte";
    import { collapseAll } from "./lib/components/FileTree/FileTreeList.svelte";
    import { terminalInstance } from "./lib/components/Terminal.svelte";
    import { writable } from "svelte/store";
    import ContextMenu from "./lib/components/ContextMenu.svelte";
    import { activeMenu } from "./scripts/Menu";
    import { paneLeft, paneBottom, paneRight, paneLeftSize, paneBottomSize, paneRightSize } from "./config/configStore";
    import { editorTabsEmpty } from "./lib/components/Tabs/EditorTabs.svelte";

    onMount(async () => {
        await loadSettings();
        document.addEventListener("click", handleMenuClickOutside);
    });

    function handleMenuClickOutside(event: MouseEvent) {
        const e = event.target as HTMLElement;
        let button = e;
        if (e.parentElement.nodeName === "BUTTON")  {
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
</script>

<svelte:window on:contextmenu|preventDefault></svelte:window>

<Titlebar showMenubar tools layout />
<div id="main">
    <Splitpanes on:resized={setSidePanelSize} dblClickSplitter={false} theme="editor-panes" on:pane-remove={adjustTerminalPanel} on:pane-add={adjustTerminalPanel} on:resize={adjustTerminalPanel}>
        {#if $paneLeft}
            <Pane size={$paneLeftSize}>
                <WindowPane content={FileTree} title="File Explorer" tools={[
                    {name: "New File...", icon: AddFile},
                    {name: "New Folder...", icon: AddFolder},
                    {name: "Refresh Explorer", icon: Refresh},
                    {name: "Collapse All Folders", icon: CollapseAll, action: () => {
                        collapseAll();
                    }}
                ]}></WindowPane>
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
                        <WindowPane bottom title="Terminal" ellipsis menu={{children: [{name: "test1", shortcut: null, action: null, disabled: false}]}} />
                    </Pane>
                {/if}
            </Splitpanes>
        </Pane>
        {#if $paneRight}
            <Pane size={$paneRightSize}>
                <WindowPane
                    title="Notifications" 
                    content={Notifications} 
                    ellipsis 
                    menu={{children: [{name: "test1", shortcut: null, action: null, disabled: false}]}}
                ></WindowPane>
            </Pane>
        {/if}
    </Splitpanes>
</div>
<Statusbar />

<ContextMenu target={$contextMenu.target} items={$contextMenu.items} menuOpen={$contextMenu.open} />