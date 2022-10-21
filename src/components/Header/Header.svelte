<script lang="ts">
    import Menu from "../Menu/Menu.svelte";
    import { HeaderNav, HeaderNavMenu, HeaderNavItem } from "carbon-components-svelte";
    import "../../overrides.css";
	import { filemenu, editmenu, viewmenu, runmenu, helpmenu} from "../Menu/menu";
    import { appWindow } from "@tauri-apps/api/window";
    import { workspacename } from "../FileTree/scripts/TreeStore";
</script>
<div id="header">
    <div id="logo"></div>
    <div id="menubar">
        <Menu name="File" options={filemenu}></Menu>
        <Menu name="Edit" options={editmenu}></Menu>
        <Menu name="View" options={viewmenu}></Menu>
        <Menu name="Run" options={runmenu}></Menu>
        <Menu name="Help" options={helpmenu}></Menu>
    </div>
    <div id="workspace">
        <HeaderNav>
            <HeaderNavMenu text={$workspacename}>
                <HeaderNavItem text="Open New Workspace..." />
                <HeaderNavItem text="Open Recent Workspace" />
                <HeaderNavItem text="Close Workspace" />
            </HeaderNavMenu>
        </HeaderNav>
    </div>
    <div id="handle" data-tauri-drag-region></div>
    <div id="windowcontrols">
        <div
            class="window-button"
            id="minimize"
            on:click={() => appWindow.minimize()}
        />
        <div
            class="window-button"
            id="maximize"
            on:click={async () => { (await appWindow.isMaximized()) ? appWindow.unmaximize() : appWindow.maximize(); }}
        />
        <div
            class="window-button"
            id="close"
            on:click={async () => await appWindow.close()}
        />
    </div>
</div>

<style>
    #header {
        z-index: 8000;
        width: 100%;
        display: flex;
        height: 2rem;
        align-items: center;
        border-bottom: 1px solid #393939;
        background-color: #161616;
    }
    #logo {
        background-size: 20px;
        background-repeat: no-repeat;
        height: 100%;
        min-width: 35px;
        position: relative;
        content: '';
        background-image: url("/assets/images/Icon\(1\).png");
        background-position: center;
        z-index: 10;
    }
    #menubar {
        height: 100%;
        display: flex;
        z-index: 10;
    }
    #workspace {
        height: 100%;
        width: fit-content;
        max-width: 200px;
        overflow-x: clip;
        z-index: 10;
    }
    :global(#workspace a.bx--header__menu-item) {
        flex-direction: row-reverse;
        cursor: pointer;
    }
    :global(#workspace .bx--header__menu-arrow) {
        display: none;
    }
    :global(#workspace .bx--header__menu-title.bx--header__menu) {
        width: 100% !important;
    }

    #handle {
        position: absolute;
        height: 2rem;
        width: -webkit-fill-available;
        z-index: 9;
    }

    #windowcontrols {
        margin-left: auto;
        height: 100%;
        display: flex;
        z-index: 10;
    }
    .window-button {
        min-width: 47px;
        height: 100%;
        line-height: 34px;
        text-align: center;
        padding-right: 5px;
        padding-left: 5px;
        font-size: 14px;
        color: white;
        cursor: pointer;
    }
    #minimize::before {
        content: "\2014";
    }
    #maximize::before {
        content: "\eabb";
    }
    #close::before {
        content: "\2715";
        line-height: 30px;
    }
    .window-button:not(#close):hover {
        background-color: #262626;
    }
    #close:hover {
        background-color: rgb(255, 49, 49);
    }
    
</style>