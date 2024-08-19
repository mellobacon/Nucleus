<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    const dispatch = createEventDispatcher();

    export let readonly = false;
    export let label = null;
    export let placeholder = "";
    export let hintText = "";
    export let invalidText = "";

    export let value = "";
    export let _class = "";
    export let extra_small = false;
    export let medium = false;
    export let invalid = false;

    let ref: HTMLElement = null;

    onMount(() => {
        ref.focus();
    })

    let _ = null;
    async function handleInput(e) {
        clearTimeout(_);
        invalid = false;
        _ = setTimeout(() => {
            dispatch("d_input", {value: value})
        }, 500);
    }
</script>

<div class="input-container {_class}">
    {#if label}
        <label for="textInput">{label}:</label>
    {/if}

    <input on:input={handleInput} 
    bind:this={ref}
    autocomplete="off"
    class="mousetrap" 
    class:invalid 
    class:medium 
    class:extra_small 
    class:readonly 
    bind:value type="text" name="textInput" id="textInput" readonly={readonly} placeholder={placeholder}>
    {#if hintText && !invalid}
        <div class="hint-text" >{hintText}</div>
    {/if}
    {#if invalidText && invalid}
        <div class="hint-text" class:invalid>{invalidText}</div>
    {/if}
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
    .hint-text {
        padding: 0 2px;
        font-size: 0.9rem;
    }
    .readonly {
        cursor: not-allowed;
    }
</style>