<script lang="ts">
    export let tree = [];
</script>

{#if tree.length === 0}
    <div class="container">
        <span>No folder/workspace open</span>
        <button class="toolbar-button">Open Folder</button>
    </div>
{/if}

<style lang="scss">
    .toolbar-button {
        background-color: #222222;
        color: #fff;
        font-family: inherit;
        text-align: center;
        padding: 7px 30px;
        margin-top: 10px;
        margin-bottom: 5px;
        display: inline-block;
        cursor: pointer;
        padding: 5px 25px;
        font-size: 0.875rem;
    }
    .toolbar-button:hover {
        background-color: rgb(50 50 50);
    }
    .container {
        display:flex; 
        flex-direction:column; 
        align-items: center;
        justify-content:center;
        min-height: 70vh;
        margin-top: 10px;
        margin-bottom: 5px;
        &>span {
            margin-top: 10px;
            margin-bottom: 5px;
            text-align: center;
            font-size: 0.875rem;
        }
    }
</style>