<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let readonly = false;
    export let label = null;
    export let placeholder = "";

    export let value = "";
    export let _class = "";
    export let extra_small = false;
    export let medium = false;

    let _ = null;
    async function handleInput(e) {
        clearTimeout(_);
        _ = setTimeout(() => {
            dispatch("d_input", {value: value})
        }, 500);
    }
</script>

<div class="input-container {_class}">
    {#if label}
        <label for="textInput">{label}:</label>
    {/if}

    <input on:input={handleInput} class="mousetrap" class:medium class:extra_small class:readonly bind:value type="text" name="textInput" id="textInput" readonly={readonly} placeholder={placeholder}>
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
        &.extra_small {
            width: 12% !important;
            padding: 0.4rem !important;
        }
        &.medium {
            width: 30% !important;
            padding: 0.4rem !important;
        }
        border: none;
        padding: 0.6em 0.4em 0.6em 0.8em;
        width: 100%;
    }
    .readonly {
        cursor: not-allowed;
        background-color: #2d2d2d;
    }
</style>