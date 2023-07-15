<script lang="ts">
    import { onMount } from "svelte";
    import { appSettings } from "../config/config";
    import Input from "./utility/Input.svelte";
    import Select from "./utility/Select.svelte";
    import FileTreeView from "./FileTree/FileTreeView.svelte";
    import { getThemes } from "../config/themehandler";
    import { addEditorTab } from "./EditorTabList.svelte";

    export let hidden = true;

    let editorFontSize;
    let editorFontFamily;
    let nucleusTheme;
    let editorAutosave;
    onMount(async () => {
        editorFontSize = await appSettings.get("editor.fontSize");
        editorFontFamily = await appSettings.get("editor.fontFamily");
        editorAutosave = await appSettings.get("editor.autosave");
        nucleusTheme = await appSettings.get("nucleus.theme");
    })

    async function handleSelect(e) {
        await appSettings.set("editor.autosave", e.detail.selection);
        await appSettings.save();
    }
    async function handleThemeSelect(e) {
        await appSettings.set("nucleus.theme", e.detail.selection);
        await appSettings.save();
    }
    async function handleInput(e) {
        await appSettings.set("editor.fontSize", e.detail.value);
        await appSettings.save();
    }
    async function handleFamilySelect(e) {
        await appSettings.set("editor.fontFamily", e.detail.value);
        await appSettings.save();
    }
</script>

<div class="settings-container" class:hidden>
    <div class="settings-directory">
        <FileTreeView isExpanded iconsEnabled={false} tree={[
            {id: 0, path: "", name: "General", children: [
                {id: 1, path: "", name: "Theme"},
                {id: 2, path: "", name: "Editor", children: [
                    {id: 3, path: "", name: "Autosave"},
                    {id: 4, path: "", name: "Font Size"},
                    {id: 5, path: "", name: "Font Family"}
                ]},
            ]},
        ]}></FileTreeView>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span id="json" on:click={() => {addEditorTab(appSettings.path, "settings.json")}}>open settings.json</span>
    </div>
    <div class="settings">
        <div class="settings-list">
            <div class="settings-category">
                <div class="heading">General</div>
                <div class="content">
                    <Select label="Theme" items={getThemes()} selected={nucleusTheme} on:select={handleThemeSelect}></Select>
                </div>
            </div>
            <div class="settings-category">
                <div class="heading">Editor</div>
                <div class="content">
                    <Select label="Autosave" items={[{id: 0, name: "false"}, {id: 1, name: "true"}]} selected={editorAutosave} on:select={handleSelect}></Select>
                    <Input _class="settings-input" placeholder="default: 14" value={editorFontSize} extra_small label="Font Size" on:d_input={handleInput} />
                    <Input _class="settings-input" placeholder="monospace" value={editorFontFamily} medium label="Font Family" on:d_input={handleFamilySelect} />
                </div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .hidden {
        display: none !important;
    }
    .settings-container {
        background-color: #171717;
        height: 100%;
        display: flex;
    }
    .settings {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .settings-list {
        padding: 0 20px;
        display: flex;
        flex-direction: column;
    }
    .settings-directory {
        min-width: 13rem;
        height: 100%;
        border-right: 0.5px solid #333;
        overflow: hidden;
        display: flex;
        align-items: center;
        flex-direction: column;
        #json {
            font-size: 0.9rem;
            color: #939393;
            cursor: pointer;
            text-decoration: underline;
            &:hover {
                color: #4d73ad;
            }
            padding: 10px 0;
        }
    }
    .settings-category {
        padding: 10px 0;
    }
    .heading {
        font-weight: 600;
        font-size: 20px;
        &::after {
            height: 0.05rem;
            width: 100%;
            background-color: #333;
            content: "";
            display: block;
            margin-top: 10px;
        }
    }
    :global(.settings-input) {
        margin: 10px 0;
    }
</style>