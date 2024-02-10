<script lang="ts">
    import { isfile } from "./EditorTabList.svelte";
    import { line_info, language, encoding, spaces } from "./Editor.svelte";
    import { getVersion } from '@tauri-apps/api/app';
    import { onMount } from "svelte";
    import { Terminal as TerminalIcon } from "carbon-icons-svelte";
    import { invoke } from "@tauri-apps/api";
    import Terminal from "./Terminal.svelte";
    import { workingDir } from "./File";

    let appVersion = "";
    onMount(async () => {
        appVersion = await getVersion();
    })

    const tools = [
        {name: "Terminal", content: Terminal, icon: TerminalIcon, action: (t) => {spawnTerminal(t)}}
    ]

    async function spawnTerminal(t) {
        if ($externalTerminal) {
            invoke("open_terminal", {path: $workingDir});
        }
        else {
            toggleBottomPanel(t);
        }
    }
</script>
<script lang="ts" context="module">
    import { writable } from "svelte/store";
    export let showBottomPanel = writable(false);
    export let externalTerminal = writable(false);
    let show = false;

    export let editortool = writable({name: "", content: null});

    export function toggleBottomPanel(x = null) {
        show = !show;
        showBottomPanel.set(show);
        if (x) {
            editortool.set({name: x.name, content: x.content});
        }
    }
    export function hideBottomPanel() {
        show = false;
        showBottomPanel.set(false);
    }
    export function setTerminalState(value) {
        let v = value === "true" ? true : false;
        externalTerminal.set(v);
    }
</script>

<div id="statusbar">
    <div id="title">
        <span>Nucleus <span id="version">v{appVersion}-alpha</span></span>
        <div class="divider"></div>
    </div>
    <div class="editor-tools">
        {#each tools as tool}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="tool" title={tool.name} on:click={() => {tool.action(tool)}}>
                <svelte:component this={tool.icon}></svelte:component>
            </span>
        {/each}
    </div>
    {#if $isfile}
        <div class="editor-info">
            <span title="Indentation">Spaces: {$spaces}</span>
            <div class="divider"></div>
            <span title="Ln: {$line_info.line}, Col: {$line_info.column}">{$line_info.line} : {$line_info.column}</span>
            <div class="divider"></div>
            <span>{$encoding.value} {$encoding.hasBom === true ? " with BOM" : ""}</span>
            <div class="divider"></div>
            <span>{$language}</span>
        </div>
    {/if}
</div>

<style lang="scss">
    #statusbar {
        z-index: 8000;
        width: -webkit-fill-available;
        display: flex;
        align-items: center;
        font-size: 0.9rem;
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
        }
    }
    .divider {
        width: 0.0625rem;
		height: 1rem;
    }
    .editor-tools {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding-left: 10px;
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
        flex-grow: 1;
        font-size: 13px;
        height: 100%;
        span {
            padding: 0 7px;
            height: 100%;
            display: flex;
            align-items: center;
        }
    }
    #version {
        font-size: 0.7rem;
        padding: 0 !important;
        color: #6d6d6d;
    }
</style>
