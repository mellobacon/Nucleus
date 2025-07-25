<script lang="ts">
    import { onMount, afterUpdate } from "svelte";
    import { get, writable } from "svelte/store";
    import { Tab } from "../../../scripts/Tab";
    import TabList from "./TabList.svelte";
    import { getCurrentWindow } from "@tauri-apps/api/window";
    import Menu from "../Menu.svelte";
    import Ellipsis from "../../../assets/icons/ellipsis.svelte";
    import Run from "../../../assets/icons/run.svelte";
    import RunDebug from "../../../assets/icons/run_debug.svelte";
    import Config from "../../../assets/icons/config.svelte";
    import { tooltip } from "../../../scripts/tooltip";
    import { moveItemInArray } from "../../../config/config";
    import Editor from "../../Editor.svelte";

    onMount(() => {
        getCurrentWindow().onResized(() => {
            updateTablistWidth();
        })
    })

    afterUpdate(() => {
        updateTablistWidth();
    })
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
    let activetabid = null;
    class EditorTab extends Tab {
        saved = true;
        constructor() {
            super();
        }
        refreshView(tab) {
            if (tab.isfile) {
                tab.content.updateTheme();
            }
        }
        setActive(id) {
            super.setActive(id);
            activetabid = id;
        }
        addEditorTab(path?: string, label?: string) {
            let content = new Editor({target: document.getElementById("tab-view")});
            this.addTab(path, label, content, {saveState: this.saved, isFile: true});
            this.updateView();
        }
    }

    const editorTab = new EditorTab();

    export function addTab(path?: string, label?: string, content = null) {
        editorTab.addTab(path, label, content);
    }
    export async function addEditorTab(path?: string, label?: string) {
        editorTab.addEditorTab(path, label);
    }
    export async function closeTab(tabid: number) {
        await editorTab.closeTab(tabid);
    }
    export async function closeActiveTab() {
        await editorTab.closeTab(activetabid);
    }
    export function renameTab(tab, label, path) {
        if (tab) {
            tab.label = label;
            tab.path = path;
            editorTab.setActive(tab.id);
        }
    }
    export async function closeAllTabs() {
        await editorTab.closeAllTabs();
    }
    export function getActiveTab() {
        return editorTab.activeTab;
    }
    export function getCurrentEditor() {
        return editorTab.activeTab.content;
    }
    export function refreshTabs() {
        editorTab.refreshTabList();
    }
    export function getTabs() {
        return get(editorTab.tabs);
    }
    export function setActiveTab(id) {
        editorTab.setActive(id);
    }

    export let editorTabsEmpty = editorTab.hidden;
    export let isfile = editorTab.isfile;

    let currentTabIndex = 0;
    let _tablist = [];
    let activeTab = null;
    function goToNextTab() {
        if (currentTabIndex >= _tablist.length - 1) return;
        let nextTab = _tablist[currentTabIndex + 1]
        setActiveTab(nextTab.id);
    }
    function goToPreviousTab() {
        if (currentTabIndex === 0) return;
        let previousTab = _tablist[currentTabIndex - 1]
        setActiveTab(previousTab.id);
    }

    function handleUpdate(e) {
        let last = e.detail.last;
        if (last !== undefined && _tablist.find(tab => tab.id === last.id) === undefined) {
            _tablist.push(last)
        }
        activeTab = getActiveTab();
        currentTabIndex = _tablist.findIndex(tab => tab === activeTab);
    }
    function handleSort(e)  {
        moveItemInArray(_tablist, e.detail.oldIndex, e.detail.newIndex)
    }
</script>
<div id="editor-tabs" bind:this={tablist} class:hidden={$editorTabsEmpty}>
    <TabList width={$computedWidth} tabs={editorTab.tabs} canSort on:closetab={async (e) => {await closeTab(e.detail.tabid)}} on:select={(e) => {editorTab.setActive(e.detail.tabid)}} on:arrow-next={goToNextTab} on:arrow-previous={goToPreviousTab} on:update={handleUpdate} on:sort={handleSort} on:add-tab={() => {addEditorTab()}}></TabList>
    <div class="tab-toolbar" bind:this={toolbar}>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="tool" title="Run..." use:tooltip data-tooltip-top-offset="45">
            <Run />
        </div>
        <div class="tool" title="Run w/debugger..." use:tooltip data-tooltip-top-offset="45">
            <RunDebug />
        </div>
        <div class="tool" title="Edit Profile Config..." use:tooltip data-tooltip-top-offset="45">
            <Config />
        </div>
        <Menu right menu={{icon: Ellipsis, children: [
            {name: "Close All Tabs", action: async () => {await closeAllTabs()}},
        ]}}></Menu>
    </div>
</div>

<style lang="scss">
    .hidden {
        visibility: hidden;
    }
    #editor-tabs {
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