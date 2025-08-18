<script lang="ts">
    import { createEventDispatcher } from "svelte";
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
    export let labelDirection: "top" | "left" = "top";
    export let autofocus = false;
    export let input_delay = 500;

    let ref: HTMLElement = null;

    let _ = null;
    async function handleInput(e) {
        clearTimeout(_);
        invalid = false;
        _ = setTimeout(() => {
            dispatch("d_input", {value: value})
        }, input_delay);
    }
</script>

<div class="input-container {_class}" class:label-left={labelDirection === "left"}>
    {#if label}
        <label for="textInput">{label}:</label>
    {/if}

    <!-- svelte-ignore a11y-autofocus -->
    <input on:input={handleInput} on:input autofocus={autofocus}
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
        margin: 10px 0;
        &.label-left {
            flex-direction: row;
            justify-content: flex-start;
            align-items: center;
            gap: 10px;
        }
    }
    label {
        font-size: 0.9rem;
        white-space: nowrap;
    }
    input {
        padding: 0.4rem 15px;
        outline: 1px solid var(--window-borderColor);
        border-radius: 2px;
        &.extra_small {
            width: 12% !important;
        }
        &.medium {
            width: 30% !important;
        }
        border: none;
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