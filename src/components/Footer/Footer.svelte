<script lang="ts">
    import { Terminal } from "carbon-icons-svelte";
    import { hidden, file_language, linefeed } from "../Content/Editor/scripts/Tabs";
    import { line_info } from "../Content/Editor/scripts/Editor";
    import { invoke } from "@tauri-apps/api/tauri";
    import { homeDir } from '@tauri-apps/api/path';
    import { filetree } from "../FileTree/scripts/TreeStore";
    import LanguageList from "./LanguageList.svelte";
    import { languages } from "@codemirror/language-data";

    let langs = [];
    for (let l of languages) {
        let langdata = {lang: l.name, tags: l.extensions}
        langs = [...langs, langdata];
    }

    let showlangs = false;
</script>

<div id="footer">
    <div id="info">
        <div id="apptitle">
            <span>Nucleus</span>
        </div>
    </div>
    <div id="tools">
        <span class="terminal-button tool" on:click={async() => {
            let userpath = await homeDir();
            if ($filetree.length > 0) {
                userpath = $filetree[0].path;
            }
            // opens terminal externally for the time being
            invoke("open_terminal", {path: userpath});
        }}><Terminal /> <span class="toolname">Terminal</span></span>
    </div>
    {#if !$hidden}
        <div id="codeinfo">
            <span title="End of Line Sequence">{$linefeed}</span>
            <span>{$line_info.line} : {$line_info.col}</span>
            <span on:click={
                () => {showlangs = true;}
            } id="language">{$file_language}</span>
        </div>
    {/if}
    {#if showlangs}
        <LanguageList bind:showlangs {langs}></LanguageList>
    {/if}
</div>

<style>
    #footer {
        z-index: 8000;
        width: 100%;
        display: flex;
        height: 1.4rem;
        align-items: center;
        border-top: 1px solid #393939;
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