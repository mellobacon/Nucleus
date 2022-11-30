<script lang="ts">
    import { hidden } from "../Tabs/scripts/Tab";
</script>

<div id="tabview" class:hidden={$hidden}></div>

<style>
    #tabview {
        width: 100%;
        height: 100%;
        background-color: #161616;
        z-index: 1;
        position: absolute;
    }
    .hidden {
        visibility: hidden;
    }
</style>