<script lang="ts">
    export let readonly = false;
    export let label = null;
    export let placeholder = "";

    export let value = "";
</script>

{#if label}
    <label for="textInput">{label}:</label>
{/if}

<input bind:value type="text" name="textInput" id="textInput" readonly={readonly} placeholder={placeholder}>

<style lang="scss">
    label {
        font-size: 0.9rem;
        color: #c6c6c6;
    }
    input {
        border: none;
        background-color: #333;
        border-bottom: 1px solid #6f6f6f;
        padding: 0.6em 0.4em 0.6em 0.8em;
        color: white;
        width: 100%;
    }
</style>