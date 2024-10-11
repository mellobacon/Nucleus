<script lang="ts">
    import { openFolder } from "./File";
    import { DocumentBlank, Folder, RecentlyViewed, Settings } from "carbon-icons-svelte";
    import { addEditorTab, addTab } from "./EditorTabList.svelte";
    import settings from "./Settings.svelte";
    import { getVersion } from '@tauri-apps/api/app';
    import { onMount } from "svelte";

    export let hidden = true;

    let appVersion = "";

    onMount(async () => {
        appVersion = await getVersion();
    })
</script>

<div class="container" class:hidden>
    <div class="content">
        <div class="logo"></div>

        <h1>Nucleus</h1>

        <div class="quick-actions">
            <button on:click={() => addEditorTab()} ><DocumentBlank /> New file</button>
            <button on:click={openFolder} ><Folder /> Open Folder</button>
            <!-- <button on:click={openFolder} ><RecentlyViewed /> Recent...</button> -->
            <button on:click={() => addTab("Settings", "Settings", new settings({target: document.getElementById("tabview")}))}><Settings /> Settings</button>
        </div>
    </div>

    <div class="version">v{appVersion}-alpha</div>
</div>

<style lang="scss">
    .hidden {
        display: none !important;
    }

    .container {
        display: grid;
        grid-template-areas:
            ". header ."
            ". footer .";
        grid-template-columns: 1fr 6fr 1fr;
        grid-template-rows: minmax(min-content, auto) min-content;
        height: 100%;
        width: 100%;
    }

    .content {
        grid-area: header;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .logo {
        width: 200px;
        height: 200px;
        background-image: url('assets/images/Icon(1).png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 3rem;
    }
    
    .quick-actions {
        width: 130px;
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
    }

    button {
        color: white;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        text-align: left;
        padding: 0.5rem;
        background: none;
        border: none;
        cursor: pointer;
        transition: color 0.3s ease;
    }

    button:hover {
        color: #006FF2;
    }

    button:focus {
        border: none;
        outline: none;
    }

    button :global(svg) {
        margin-right: 0.5rem;
        fill: white;
        transition: fill 0.3s ease;
    }

    button:hover :global(svg) {
        fill: #006FF2;
    }

    .version {
        color: rgba(255, 255, 255, 0.5);
        grid-area: footer;
        text-align: center;
        margin-bottom: 0.5rem;
    }
</style>