<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import { get, writable } from "svelte/store";
    import { Tab } from "../../../scripts/Tab";
    import TabList from "./TabList.svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import Menu from "../Menu.svelte";
    import Ellipsis from "../../../assets/icons/ellipsis.svelte";
    import Terminal, { terminalInstance } from "../Terminal.svelte";

    onMount(() => {
        getCurrentWindow().onResized(() => {
            updateTablistWidth();
        })
        addTerminal("Windows Powershell", "Windows Powershell")
    })

    afterUpdate(() => {
        updateTablistWidth();
    })
    
    let activetabid = null;
    class TerminalTab extends Tab {
        saved = true;
        constructor() {
            super();
        }
        updateView() {
            super.updateView();
            $terminalInstance.fitTerminal();
        }
        refreshView(tab) {
            if (tab.isfile) {
                tab.content.updateTheme();
            }
        }
        setActive(id) {
            super.setActive(id);
            activetabid = id;
            terminalInstance.set(this.activeTab.content.getTerminalInstance());
            this.updateView();
        }
    }

    const terminalTab = new TerminalTab();
    function addTerminal(path?: string, label?: string) {
        const content = new Terminal({target: document.getElementsByClassName("window-pane bottom")[0]});
        terminalTab.addTab(path, label, content, {multiple: true, saveState: terminalTab.saved});
    }
    async function closeTab(tabid: number) {
        await terminalTab.closeTab(tabid);
    }
    async function closeAllTabs() {
        await terminalTab.closeAllTabs();
    }
    function setActiveTab(id) {
        terminalTab.setActive(id)
    }

    function goToNextTab() {
        if (activetabid + 1 >= get(terminalTab.tabs).length - 1) return;
        setActiveTab(activetabid + 1);
    }
    function goToPreviousTab() {
        if (activetabid === 0) return;
        setActiveTab(activetabid - 1);
    }
</script>
<script lang="ts" context="module">
    let computedWidth = writable("");
    let toolbar: HTMLElement = null;
    let tablist: HTMLElement = null;
    export function updateTablistWidth() {
        let next = tablist.nextElementSibling;
        let tablistwidth = 0;
        if (next) {
            tablistwidth = tablist.nextElementSibling.clientWidth;
        }
        computedWidth.set(`${tablistwidth - toolbar.clientWidth}px`);
    }
</script>
<div id="terminal-tabs" bind:this={tablist}>
    <TabList _class="panel" tabs={terminalTab.tabs} canAdd on:closetab={async (e) => {await closeTab(e.detail.tabid)}} on:select={(e) => {terminalTab.setActive(e.detail.tabid)}} on:arrow-next={goToNextTab} on:arrow-previous={goToPreviousTab} on:add-tab={() => {addTerminal("Windows Powershell", "Windows Powershell")}}></TabList>
    <div class="tab-toolbar" bind:this={toolbar}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <Menu right menu={{icon: Ellipsis, children: [
            {name: "Close All Tabs", action: async () => {await closeAllTabs()}},
        ]}}></Menu>
    </div>
</div>

<style lang="scss">
    #terminal-tabs {
        width: 100%;
        justify-content: space-between;
        background-color: var(--header-background);
        color: var(--header-foreground);
        height: 38px;
        box-shadow: inset 0px -1px 0 0 var(--window-borderColor);
        display: flex;
        .tab-toolbar {
            height: 60%;
            display: flex;
            align-items: center;
            padding: 0px 5px;
            align-self: center;
            .tool {
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 5px;
                z-index: 10;
                cursor: pointer;
                :global(svg) {
                    width: 16px;
                    height: 16px;
                }
                &:hover {
                    background-color: var(--header-buttonHoverBackground);
                }
            }
        }
    }
</style>