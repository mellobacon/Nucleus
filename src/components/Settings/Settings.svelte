<script lang="ts">
    //import SettingsList, {setting} from "../Tree/SettingsList.svelte";
    import AppearanceSettings from "./settings/general/AppearanceSettings.svelte";
    export let hidden = false;

</script>
<div id="settings" class:hidden>
    <div id="settings-list">
    </div>
    <div id="settings-view">
        <div id="title">Settings View</div>
        <div id="setting">
            <AppearanceSettings></AppearanceSettings>
        </div>
    </div>
</div>

<style lang="scss">
    .hidden {
        display: none !important;
    }
    #settings {
        height: 100%;
        width: 100%;
        display: flex;
    }
    #settings-list {
        height: 100%;
        min-width: 9rem;
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