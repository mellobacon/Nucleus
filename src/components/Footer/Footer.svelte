<script lang="ts">
    import { Terminal } from "carbon-icons-svelte"
    import { isfile } from "../Tabs/scripts/Tab";
    import { invoke } from "@tauri-apps/api/tauri";
    import { homeDir } from '@tauri-apps/api/path';
    import { filetree } from "../FileTree/scripts/TreeStore";
    import LanguageList from "./LanguageList.svelte";
    import { languages } from "@codemirror/language-data";
    import { file_language, file_linefeed, line_info } from "../Editor/scripts/Editor";
    import Notifications from "../Notifications/Notifications.svelte";
    import { unreadnotifications } from "../Notifications/Notifications";

    let langs = [];
    for (let l of languages) {
        let langdata = {lang: l.name, tags: l.extensions, mode: l.load()};
        langs = [...langs, langdata];
    }
    let showlangs = false;
    const tools = [
        {name: "Notifications", content: Notifications}
    ]

    async function spawnTerminal() {
        let userpath = await homeDir();
        if ($filetree.length > 0) {
            userpath = $filetree[0].path;
        }
        // opens terminal externally for the time being
        invoke("open_terminal", {path: userpath});
    }
</script>

<script lang="ts" context="module">
    import { writable } from "svelte/store";
    export let showpanel = writable(false);
    let show = false;
    
    export let tool = writable({name: "", content: null});

    export function togglePanel(x) {
        show = !show;
        showpanel.set(show);
        tool.set({name: x.name, content: x.content});
    }
</script>

<div id="footer">
    <div id="info">
        <div id="apptitle">
            <span>Nucleus</span>
        </div>
    </div>
    <div id="tools">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class="tool" on:click={spawnTerminal}>
            <Terminal /> 
            <span class="toolname">Terminal</span>
        </span>
        {#each tools as tool}
        <span class="tool" class:updated={$unreadnotifications}>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="toolname" on:click={() => {togglePanel(tool)}}>{tool.name}</span>
            <span class="notification"></span>
        </span>
        {/each}
    </div>
    {#if $isfile}
        <div id="codeinfo">
            <span title="End of Line Sequence">{$file_linefeed}</span>
            <span>{$line_info.line} : {$line_info.col}</span>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span on:click={
                () => {showlangs = true;}
            } id="language">{$file_language}</span>
        </div>
    {/if}
    {#if showlangs}
        <LanguageList bind:showlangs {langs}></LanguageList>
    {/if}
</div>

<style lang="scss">
    #footer {
        z-index: 8000;
        width: 100%;
        display: flex;
        align-items: center;
        border-top: 1px solid #393939;
        font-size: 0.9rem;
        span {
            white-space: nowrap;
        }
    }
    #info {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        border-right: 1px solid #393939;
    }
    #codeinfo {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-grow: 1;
        font-size: 13px;
        height: 100%;
    }
    #tools {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 0 7px;
        height: 100%;
    }
    #tools span {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #tools .tool:hover {
        background-color: #b1b1b133;
        cursor: pointer;
    }
    .tool {
        height: 100%;
        padding: 0 5px;
        position: relative;
        &.updated {
            .notification {
                position: absolute;
                width: 8px;
                height: 8px;
                display: block;
                background-color: #4589ff;
                border-radius: 50%;
                top: 5px;
                left: 5px;
            }
        }
    }
    .toolname {
        margin-left: 5px;
    }
    :global(#tools span svg) {
        width: 18px;
        height: 18px;
    }
    #codeinfo span {
        padding: 0 7px;
        height: 100%;
        display: flex;
        align-items: center;
    }
    #codeinfo span:hover {
        background-color: #b1b1b133;
        cursor: pointer;
    }
    #codeinfo span:nth-child(even) {
        border-right: 1px solid #393939;
        border-left: 1px solid #393939;
    }
    
    #apptitle {
        padding: 0 15px;
    }
</style>