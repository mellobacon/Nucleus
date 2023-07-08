<script lang="ts">
    export let readonly = false;
    export let label = null;
    export let placeholder = "";

    export let value = "";
    export let _class = "";
</script>

<div class="input-container {_class}">
    {#if label}
        <label for="textInput">{label}:</label>
    {/if}

    <input class="mousetrap" class:readonly bind:value type="text" name="textInput" id="textInput" readonly={readonly} placeholder={placeholder}>
</div>

<style lang="scss">
    .input-container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    label {
        font-size: 0.9rem;
    }
    input {
        border: none;
        padding: 0.6em 0.4em 0.6em 0.8em;
        width: 100%;
    }
    .readonly {
        cursor: not-allowed;
        background-color: #2d2d2d;
    }
</style>