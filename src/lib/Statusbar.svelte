<script lang="ts">
    import Git from "../assets/icons/git.svelte";
    import Github from "../assets/icons/github.svelte";
    import Bell from "../assets/icons/bell.svelte";
    import BellAlert from "../assets/icons/bell_alert.svelte";
    import Warning from "../assets/icons/warning.svelte";
    import Error from "../assets/icons/error.svelte";
    import { tooltip } from "../scripts/tooltip";
    import { language, line_info, setEditorLanguage } from "./Editor.svelte";
    import { notifications } from "../scripts/notifications";
    import { openPanel, PanelDirection } from "../scripts/panel";
    import { openCommandPallete } from "../App.svelte";
    import { languages } from "@codemirror/language-data";
    import { editorTabsEmpty } from "./components/Tabs/EditorTabs.svelte";

    function openLanguageList() {
        console.log(languages)
        let langList = languages.flatMap(l => 
            [{"text": l.name, "shortcut": "", "command": () => {setEditorLanguage(l)}}]
        )

        langList = langList.filter(l => l.text === "HTML" || l.text === "CSS" || l.text === "JavaScript" || l.text === "TypeScript")
        langList.sort((a,b) => a.text.localeCompare(b.text));
        openCommandPallete("Select Language", "Select a language...", langList)
    }

    function openSetLineCol(ln, col) {
        openCommandPallete("Line, Column", `${ln}:${col}`, [{text: `Go to line:column`, shortcut: "", command: () => {}}], false)
    }

    function openSetEncoding() {
        openCommandPallete("Select Encoding", "UTF-8", [{text: "test", shortcut: "", command: () => {}}])
    }
</script>

<div id="statusbar">
    <div id="title">
        <span>Nucleus <span id="version">v1.0</span></span>
        <div class="divider"></div>
    </div>
    <div class="editor-tools">
        <span class="tool" use:tooltip data-tooltip-bottom title="Version Control">
            <svelte:component this={Git}></svelte:component>
            master
        </span>
    </div>
    <div class="editor-info">
        {#if !$editorTabsEmpty}
            <div class="problems" title="No Problems" use:tooltip data-tooltip-bottom>
            <span>
                <svelte:component this={Error}></svelte:component> 0
            </span>
            <span>
                <svelte:component this={Warning}></svelte:component> 0
            </span>
        </div>
        <span title="Indentation" use:tooltip data-tooltip-bottom>Spaces: 4</span>
        <div class="divider"></div>
        <span class="tool" on:click={() => openSetLineCol($line_info.ln, $line_info.col)} title="Line {$line_info.ln}, Column {$line_info.col}" use:tooltip data-tooltip-bottom>{$line_info.ln} : {$line_info.col}</span>
        <div class="divider"></div>
        <span class="tool" on:click={openSetEncoding} title="Encoding" use:tooltip data-tooltip-bottom >UTF-8</span>
        <div class="divider"></div>
        <span class="tool" title="Language" use:tooltip data-tooltip-bottom on:click={openLanguageList}>{$language}</span>
        {/if}
    </div>
    <div class="divider"></div>
    <div class="editor-tools-right">
        <span class="tool" use:tooltip data-tooltip-bottom title="GitHub" on:click={() => openPanel("Source Control", PanelDirection.Right)}>
            <svelte:component this={Github}></svelte:component>
        </span>
        <span class="tool" use:tooltip data-tooltip-bottom data-tooltip-offset="38" title="Notifications" on:click={() => openPanel("Notifications", PanelDirection.Right)}>
            {#if $notifications.length === 0}
            <svelte:component this={Bell}></svelte:component>
            {:else}
            <svelte:component this={BellAlert}></svelte:component>
            {/if}
        </span>
    </div>
</div>

<style lang="scss">
    #statusbar {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 0.9rem;
        border-top: solid 1px var(--window-borderColor);
        color: var(--statusbar-foreground);
        background-color: var(--statusbar-background);
        :global(span svg) {
            width: 20px;
            height: 20px;
        }
    }
    #title {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        span {
            height: 100%;
            padding: 0 10px;
            display: flex;
            align-items: center;
            gap: 5px;
        }
    }
    .tool:hover, .problems:hover {
        background-color: var(--statusbar-buttonBackgroundHover);
        color: var(--statusbar-buttonForegroundHover);
        cursor: pointer;
    }
    .divider {
        width: 0.0625rem;
        min-width: 0.0625rem;
		height: 1rem;
    }
    .editor-tools {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
        font-size: 13px;
        .tool {
            height: 100%;
            padding: 0 5px;
            position: relative;
            &:hover {
                cursor: pointer;
            }
        }
        span {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .editor-tools-right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        padding: 0 10px;
        .tool {
            height: 100%;
            padding: 0 5px;
            position: relative;
            &:hover {
                cursor: pointer;
            }
        }
        span {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .editor-info {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 13px;
        height: 100%;
        flex-grow: 1;
        .problems {
            display: flex;
            align-items: center;
            height: 100%;
            cursor: pointer;
            padding: 0 5px;
            span {
                display: flex;
                padding: 0 2px;
            }
            span :global(svg) {
                height: 16px !important;
                width: 16px !important;
            }
        }
        span {
            padding: 0 7px;
            height: 100%;
            display: flex;
            align-items: center;
            width: max-content;
        }
    }
    #version {
        font-size: 0.7rem;
        padding: 0 !important;
    }
</style>