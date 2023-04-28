<script lang="ts">
    let tabcontainer = null;
</script>
<div id="editor-tabs">
    <div bind:this={tabcontainer} id="editor-tablist"></div>
</div>

<style lang="scss">
    #editor-tabs {
        width: -webkit-fill-available;
        display: flex;
        justify-content: space-between;
        position: absolute;
        z-index: 2;
        #editor-tablist {
            position: relative;
            display: flex;
            overflow-x: overlay;
            &::-webkit-scrollbar {
                height: 7px;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #e8e8e81f;
            }
        }
    }
</style>