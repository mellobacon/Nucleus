<script lang="ts">
    import { onMount } from "svelte";
    import Input from "../utility/Input.svelte";
    import Popup from "../utility/Popup.svelte";
    import { _openPopup } from "../../App.svelte";
    import { checkValidFileName } from "../File";

    export let title;
    export let buttons;
    export let description = "";
    export let options = {label: "Name: ", placeholder: "Enter text..."};
    let invalid = false;
    let helpText = ""
    let invalidText = "";

    onMount(() => {
        if (!options.placeholder) {
            options.placeholder = "Enter text..."
        }
    })

    let value = "";
    async function handleButtonClick(buttonAction, cancel) {
        await buttonAction(value);
        if (!invalid || cancel) {
            _openPopup.set(false);
        }
    }

</script>
<Popup bind:open={$_openPopup} {title} {description}>
    <div class="rename-input">
        <Input bind:value bind:invalid label={"File Name"} placeholder={"Enter name..."} hintText={helpText} invalidText={invalidText} />
        <div class="divider"></div>
        <Input label={"File Type"} placeholder={"-"} readonly _class="ext" />
    </div>
    <svelte:fragment slot="buttons">
        {#each buttons as button}
            <button on:click={async () => {
                if (!button.cancel && (!checkValidFileName(value) || value === undefined || !value)) {
                    invalid = true;
                    invalidText = `{${value === "" ? "null" : value}} is not a valid file name`;
                    return;
                }
                await handleButtonClick(button.action, button.cancel);
            }}>{button.name}</button>
        {/each}
    </svelte:fragment>
</Popup>

<style lang="scss">
    .rename-input {
        display: flex;
    }
    .divider {
        width: 0.025rem;
        height: 2.56rem;
        margin: 24px 0px 0 0px;
        content: "";
    }
    :global(.ext) {
        flex-grow: inherit;
        width: unset !important;
    }
</style>