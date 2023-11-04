<script lang="ts">
    import VerticalDots from "carbon-icons-svelte/lib/OverflowMenuVertical.svelte";
    import Dropdown from "./utility/Dropdown.svelte";
    import TabList from "./Tab/TabList.svelte";
    import NotSupported from "./utility/NotSupported.svelte";
    import { Tab } from "./Tab/Tab";
    import { afterUpdate, onMount } from "svelte";
    import { appWindow } from "@tauri-apps/api/window";
    import { writable } from "svelte/store";
    import { invoke } from "@tauri-apps/api";

    onMount(() => {
        appWindow.onResized(() => {
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
        let tablistwidth = tablist.nextElementSibling.clientWidth;
        computedWidth.set(`${tablistwidth - toolbar.clientWidth}px`);
    }
    let activetabid = null;
    class EditorTab {
        id: number;
        label: string;
        active: boolean;
        path: string;
        content;
        isfile: boolean;
        saved = true;
        constructor(id: number, label = "", content = null, path = "") {
            this.id = id;
            this.label = label === "" ? `Untitled-${id}` : label;
            this.path = path === "" ? this.label : path;
            this.content = content;
        }
        updateView(id) {
            this.content.$set({ hidden: !(this.id === id) });
        }
        refreshView(tab) {
            if (tab.isfile) {
                tab.content.updateTheme();
            }
        }
        setActive(id) {
            editorTab.setActive(id);
            activetabid = id;
        }
    }

    const editorTab = new Tab(EditorTab);

    export function addTab(path?: string, label?: string, content = null) {
        editorTab.addTab(path, label, content);
    }
    export async function addEditorTab(path?: string, label?: string) {
        if (path && !await invoke("is_supported", {path: path})) {
            addTab(path, label, new NotSupported({target: document.getElementById("tabview"), props: {path: path}}));
            return;
        }
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

    export let hidden = editorTab.hidden;
    export let isfile = editorTab.isfile;
    export let tabs = editorTab.tabs;
</script>
<div id="editor-tabs" bind:this={tablist} class:hidden={$hidden}>
    <TabList width={$computedWidth} tabs={tabs} on:closetab={async (e) => {await closeTab(e.detail.tabid)}} on:select={(e) => {editorTab.setActive(e.detail.tabid)}}></TabList>
    <div class="tab-toolbar" bind:this={toolbar}>
        <Dropdown right menu={{icon: VerticalDots, children: [
            {name: "Close All Tabs", action: async () => {await closeAllTabs()}},
        ]}}></Dropdown>
    </div>
</div>

<style lang="scss">
    .hidden {
        visibility: hidden;
    }
    #editor-tabs {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    .tab-toolbar {
        height: 100%;
        display: flex;
        align-items: center;
        color: white;
        padding: 0 5px;
    }
</style>