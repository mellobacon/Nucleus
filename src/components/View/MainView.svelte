<script lang="ts">
    import { Splitpanes, Pane } from "svelte-splitpanes";
    import Editor from "./Editor.svelte";
    import Footer, { showpanel, tool } from "../Footer/Footer.svelte";
    import EditorTabs from "../Tabs/EditorTabs.svelte";

    let panelsize = 20;
    function updatePanelSize(event) {
        if ($showpanel) {
            panelsize = event.detail[1].size;
        }
    }
</script>

<div id="container">
    <Splitpanes theme="editor-pane" horizontal on:resized={updatePanelSize}>
        <Pane>
            <div class="main">
                <EditorTabs />
                <Editor />
            </div>
        </Pane>
        {#if $showpanel}
            <Pane bind:size={panelsize} minSize={5}><div class="panel">
                <svelte:component this={$tool.content}></svelte:component>
            </Pane>
        {/if}
    </Splitpanes>
    <Footer></Footer>
</div>

<style lang="scss">
    .panel {
        width: 100%;
        height: 100%;
        overflow: overlay;
        &::-webkit-scrollbar {
            width: 12px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: #4c4c4c38;
        }
    }
    #container {
        height: 100%;
        overflow: hidden;
    }
    .main {
        background-image: url("/assets/images/Watermark(3).png");
        background-repeat: no-repeat;
        background-position: center;
    }
</style>