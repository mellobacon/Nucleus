<script>
    import { Commands } from "../config/commands";
    import ShortcutButton from "./components/ShortcutButton.svelte";

    export let hidden = false;
</script>

<div id="container" class:hidden>
    <div class="top">
        <h1>Nucleus</h1>
        <div class="shortcuts">
            <span on:click={Commands.commands.openCommandPallete.command}>
                <div>Show Command Palette</div>
                <ShortcutButton shortcut={Commands.commands.openCommandPallete.keybind} />
            </span>
            <span on:click={Commands.commands.createNewFile.command}>
                <div>Create New File</div>
                <ShortcutButton shortcut={Commands.commands.createNewFile.keybind} />
            </span>
            <span on:click={Commands.commands.openFile.command}>
                <div>Open File</div>
                <ShortcutButton shortcut={Commands.commands.openFile.keybind} />
            </span>
            <span>
                <div>Open Recents</div>
                <ShortcutButton shortcut={Commands.commands.openRecents.keybind} />
            </span>
            <span on:click={Commands.commands.fullscreen.command}>
                <div>Toggle Fullscreen</div>
                <ShortcutButton shortcut={Commands.commands.fullscreen.keybind} />
            </span>
        </div>
    </div>
</div>

<style lang="scss">
    #container {
        height: 100%;
        width: 100%;
        background-color: var(--window-centerBackground);
        display: grid;
        grid-template-areas:
            "header"
            "footer";
        justify-items: center;
        align-content: center;
        grid-template-rows: 0.5fr 0.2fr;
        &.hidden {
            display: none;
        }
        .top {
            grid-area: "header";
        }
        .top {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            h1 {
                font-size: 2.5rem;
                margin-bottom: 3rem;
            }
            .shortcuts {
                display: flex;
                flex-direction: column;
                align-items: center;
                span {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    text-align: left;
                    padding: 0.5rem;
                    background: none;
                    border: none;
                    transition: color 0.3s ease;
                    color: var(--window-accent);
                    gap: 15px;
                    :global(svg) {
                        width: 20px;
                        height: 20px;
                    }
                    &:hover {
                        cursor: pointer;
                        div {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }
</style>