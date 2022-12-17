<script lang="ts">
    import SettingsTree, {setting} from "./SettingsTree.svelte";
    import AppearanceSettings from "./settings/general/AppearanceSettings.svelte";
    export let hidden = false;

</script>
<div id="settings" class:hidden>
    <div id="settings-list">
        <SettingsTree></SettingsTree>
    </div>
    <div id="settings-view">
        <div id="title">{$setting}</div>
        <div id="setting">
            <AppearanceSettings></AppearanceSettings>
            <span class="note">Settings incomplete. Everything is nonfunctional except for autosave</span>
        </div>
    </div>
</div>

<style lang="scss">
    .hidden {
        display: none !important;
    }
    .note {
        font-weight: 200;
        font-size: 0.7rem;
        color: #ffdc68;
        text-decoration: underline;
        margin-top: 50px;
        display: block;
    }
    #settings {
        height: 100%;
        width: 100%;
        display: flex;
        background: #1c1c1c;
        overflow-y: hidden;
        overflow-x: overlay;
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #4c4c4c38;
        }
    }
    #settings-list {
        height: 100%;
        min-width: 15rem;
        border-right: solid 1px #333;
        padding-top: 1rem;
    }
    #settings-view {
        height: 100%;
        width: 100%;
        #title {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: solid 1px #333;
            font-size: 1.2rem;
            min-height: 3rem;
        }
    }
    #setting {
        height: 100%;
        width: 100%;
        padding: 10px;
    }
</style>