<script>
    import AddFile from "../assets/icons/add_file.svelte";
    import Folder from "../assets/icons/folder.svelte";
    import FolderOpen from "../assets/icons/folder_open.svelte";
    import Git from "../assets/icons/git.svelte";
    import Settings from "../assets/icons/settings.svelte";
    import { Commands } from "../config/commands";

    export let hidden = false;
</script>
<div id="welcome" class:hidden>
    <div class="content">
        <div class="logo"></div>

        <h1>Nucleus</h1>

        <div class="quick-actions">
            <button on:click={() => Commands.commands.createNewFile}>
                <svelte:component this={AddFile}></svelte:component>
                New File
            </button>
            <button on:click={() => Commands.commands.openFile}>
                <svelte:component this={FolderOpen}></svelte:component>
                Open File
            </button>
            <button on:click={() => Commands.commands.openFolder}>
                <svelte:component this={Folder}></svelte:component>
                Open Folder
            </button>
            <button>
                <svelte:component this={Git}></svelte:component>
                Clone From Version Control
            </button>
            <button on:click={() => Commands.commands.openSettings}>
                <svelte:component this={Settings}></svelte:component>
                Settings
            </button>
        </div>
    </div>
</div>

<style lang="scss">
    #welcome {
        display: grid;
        grid-template-areas:
            ". header ."
            ". footer .";
        grid-template-columns: 1fr 6fr 1fr;
        height: 100%;
        width: 100%;
        background-color: var(--window-centerBackground);
        &.hidden {
            display: none;
        }
        .content {
            grid-area: header;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .logo {
                width: 200px;
                height: 200px;
                background-image: url('src/assets/LogoWatermark.png');
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }

            h1 {
                font-size: 2.5rem;
                margin-bottom: 3rem;
            }
            .quick-actions {
                display: flex;
                flex-direction: column;
                padding-left: 70px;
                align-items: center;
            }
            button {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                text-align: left;
                padding: 0.5rem;
                background: none;
                border: none;
                transition: color 0.3s ease;
                color: var(--window-accent);
                gap: 5px;
                :global(svg) {
                    width: 20px;
                    height: 20px;
                }
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
</style>