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
    }
    input {
        border: none;
        padding: 0.6em 0.4em 0.6em 0.8em;
        width: 100%;
    }
</style>