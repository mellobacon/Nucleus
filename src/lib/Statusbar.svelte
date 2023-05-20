<script lang="ts">
    import { isfile } from "./EditorTabList.svelte";
    import { line_info } from "./Editor.svelte";
</script>

<div id="statusbar">
    <div id="title">
        <span>Nucleus</span>
        <div class="divider"></div>
    </div>
    <div class="editor-tools">
        
    </div>
    {#if $isfile}
        <div class="editor-info">
            <span title="Ln: {$line_info.line}, Col: {$line_info.column}">{$line_info.line} : {$line_info.column}</span>
            <div class="divider"></div>
            <span>UTF-8</span>
            <div class="divider"></div>
            <span>Unknown</span>
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
    }
    #title {
        color: #8c8c8c;
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
    }
    .editor-info {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-grow: 1;
        font-size: 13px;
        height: 100%;
        color: #8c8c8c;
        span {
            padding: 0 7px;
            height: 100%;
            display: flex;
            align-items: center;
        }
    }
</style>