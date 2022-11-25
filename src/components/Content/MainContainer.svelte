<script lang="ts">
    import { Splitpanes, Pane } from "svelte-splitpanes";
    import Editor from "./Editor/Editor.svelte";
    import Footer, { showpanel, tool } from "../Footer/Footer.svelte";
    import EditorTabs from "./Editor/EditorTabs.svelte";

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
            <Pane bind:size={panelsize} minSize={4}><div class="panel">{$tool.content}</Pane>
        {/if}
    </Splitpanes>
    <Footer></Footer>
</div>

<style>
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