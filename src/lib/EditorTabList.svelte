<script lang="ts">
    import VerticalDots from "carbon-icons-svelte/lib/OverflowMenuVertical.svelte";
    import Dropdown from "./utility/Dropdown.svelte";
    import TabList from "./Tab/TabList.svelte";
    import { Tab } from "./Tab/Tab";
</script>
<script lang="ts" context="module">
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
    export function addEditorTab(path?: string, label?: string) {
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
    async function closeAllTabs() {
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
<div id="editor-tabs" class:hidden={$hidden}>
    <TabList tabs={tabs} on:closetab={async (e) => {await closeTab(e.detail.tabid)}} on:select={(e) => {editorTab.setActive(e.detail.tabid)}}></TabList>
    <div class="tab-toolbar">
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
        width: -webkit-fill-available;
        display: flex;
        justify-content: space-between;
        position: absolute;
    }
    .tab-toolbar {
        height: 100%;
        display: flex;
        align-items: center;
        color: white;
        padding: 0 5px;
    }
</style>