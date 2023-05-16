<script lang="ts">
    import VerticalDots from "carbon-icons-svelte/lib/OverflowMenuVertical.svelte";
    import Dropdown from "./utility/Dropdown.svelte";
    import TabList from "./Tab/TabList.svelte";
    import { Tab } from "./Tab/Tab";
    import Editor from "./Editor.svelte";
</script>
<script lang="ts" context="module">
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
    }

    const editorTab = new Tab(EditorTab);

    export function addTab(path?: string, label?: string) {
        editorTab.addTab(path, label);
    }
    export function addEditorTab(path?: string, label?: string) {
        editorTab.addEditorTab(path, label);
    }
    export function closeTab(tabid: number) {
        editorTab.closeTab(tabid);
    }

    export let hidden = editorTab.hidden;
    export let isfile = editorTab.isfile;
    let tabs = editorTab.tabs;
</script>
<div id="editor-tabs" class:hidden={$hidden}>
    <TabList tabs={tabs} on:closetab={(e) => {closeTab(e.detail.tabid)}} on:select={(e) => {editorTab.setActive(e.detail.tabid)}}></TabList>
    <div class="tab-toolbar">
        <!-- TODO: Fix dropdown position
            <Dropdown right menu={{icon: VerticalDots, children: [
            {name: "Close All Tabs", action: () => {editorTab.CloseAllTabs()}},
            {name: "Close Saved Tabs", disabled: true}
        ]}}></Dropdown>
        -->
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