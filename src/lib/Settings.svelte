<script lang="ts">
    import { OverlayScrollbarsComponent } from "overlayscrollbars-svelte";
    import Checkbox from "./components/Checkbox.svelte";
    import FileTreeView from "./components/FileTree/FileTreeView.svelte";
    import Input from "./components/Input.svelte";
    import Select from "./components/Select.svelte";
    import Searchbar from "./components/Searchbar.svelte";

    export let hidden = false;

    let x = [
        {id: 0, name: "General", path: ""}
    ]
    let y = [{id: 1, name: "Editor", path: "", children: [
            {id: 2, name: "Font", path: ""},
            {id: 3, name: "Appearance", path: ""},
            {id: 4, name: "Code", path: ""},
            {id: 5, name: "Editor Tabs", path: ""},
            {id: 6, name: "New File", path: ""}
        ]}]
    let z = [{id: 7, name: "Settings3", path: ""}]
</script>
<div id="settings" class:hidden>
    <div id="settings-index">
        <Searchbar buttonTitle="Search" buttonIcon button fluid placeholder="Search Settings..."></Searchbar>
        <OverlayScrollbarsComponent options={{ scrollbars: { theme: 'editor-scrollbar', autoHide: "leave", autoHideSuspend: true, autoHideDelay: 300 } }} defer class="overlay-scrollbars-filetree">
            <FileTreeView tree={x}></FileTreeView>
            <FileTreeView tree={y}></FileTreeView>
            <FileTreeView tree={z}></FileTreeView>
        </OverlayScrollbarsComponent>
    </div>
    <div id="settings-view">
        <!------------------GENERAL------------------>
        <h2>General</h2>
        <div class="setting">
            <Select labelDirection="left" label="Theme" items={[
                {id: 0, name: "Nucleus Dark"},
                {id: 1, name: "Nucleus Light"},
                {id: 2, name: "Nucleus Gruv"},
            ]} />
            <small>Edit current theme in the <a>settings.json</a></small>
        </div>
        <div class="setting">
            <Select labelDirection="left" label="Keymap" items={[
                {id: 0, name: "Nucleus"},
            ]} />
            <small>Sets shortcuts used in the editor</small>
        </div>
        <div class="setting">
            <Select labelDirection="left" label="Zoom" items={[
                {id: 0, name: "100%"},
            ]}/>
        </div>
        <div class="setting">
            <Select labelDirection="left" label="Autosave" items={[
                {id: 0, name: "Off"},
                {id: 1, name: "Duration: 300ms"},
                {id: 2, name: "500ms"},
                {id: 3, name: "5 minutes"},
            ]} />
            <small>Sets automatic file saving in the editor</small>
        </div>
        <!------------------Editor------------------>
        <h2>Editor</h2>
        <h4>Font</h4>
        <div class="setting">
            <Select labelDirection="left" label="Font Family" items={[
                {id: 0, name: "Fira Code"},
            ]}/>
        </div>
        <div class="setting">
            <Input label="Font Size" placeholder="default: 14" labelDirection="left" />
            <small>Sets font size in the editor (not app)</small>
        </div>
        <div class="setting">
            <Input label="Line Height" placeholder="default: 1.2" labelDirection="left" />
        </div>
        <div class="setting">
            <Checkbox label="Enable Ligatures" checked />
            <small>Sets ligatures in the editor font (if applicable)</small>
        </div>
        <h4>Appearance</h4>
        <div class="setting">
            <Select labelDirection="left" label="Show Whitespace" items={[
                {id: 0, name: "None"},
            ]} />
            <small>Show whitespace in the editor. Useful for something idk</small>
        </div>
        <h4>Code</h4>
        <div class="setting">
            <Checkbox label="Show Indent Guides" checked />
        </div>
        <div class="setting">
            <Checkbox label="Auto Indent" checked />
        </div>
        <div class="setting">
            <Checkbox label="Line Numbers" />
        </div>
        <div class="setting">
            <Select labelDirection="left" label="Indent Using" items={[
                {id: 0, name: "Spaces"},
                {id: 1, name: "Tabs"},
            ]} />
            <small>Note: If its not spaces you're wrong and should feel wrong</small>
        </div>
        <div class="setting">
            <Input label="Indent Size" placeholder="default: 4" labelDirection="left" />
        </div>
    </div>
</div>

<style lang="scss">
    small {
        color: var(--window-secondaryForeground)
    }
    #settings {
        width: 100%;
        height: calc(100% + 1px);
        display: flex;
        overflow: hidden;
        background-color: var(--window-centerBackground);
        &.hidden {
            display: none;
        }
        #settings-index {
            height: 100%;
            width: 200px;
            border-right: 1px solid var(--window-borderColor);
            display: flex;
            flex-direction: column;
            padding: 30px 20px;
            gap: 10px;
            :global(.tree) {
                font-size: 16px;
                padding-bottom: 3px;
                :global(.arrow svg) {
                    width: 24px;
                    height: 24px;
                }
                :global(.no-arrow) {
                    margin-right: 28px;
                }
            }

            :global(.searchbar) {
                height: 25px;
            }
        }
        #settings-view {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 30px 20px;
            gap: 5px;
            overflow: auto;
            scroll-behavior: smooth;
            h2 {
                margin: 0;
                padding: 0 0 10px 0;
                border-bottom: 1px solid var(--window-borderColor)
            }
            .setting {
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 10px;
                :global(>div) {
                    display: grid;
                    align-items: center;
                    grid-gap: 10px;
                    grid-template-columns: 200px minmax(200px, 0.5fr);
                    font-size: 15px;
                }
            }
        }
    }
</style>
