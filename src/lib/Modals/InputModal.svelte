<script lang="ts">
    import { onMount } from "svelte";
    import Input from "../utility/Input.svelte";
    import Popup from "../utility/Popup.svelte";
    import Button from "../utility/Button.svelte";
    import { _openPopup } from "../../App.svelte";
    import { checkValidFileName } from "../File";
    import { fs, invoke, path as p } from "@tauri-apps/api";

    export let title;
    export let buttons;
    export let description = "";
    export let options = {label: null, placeholder: "Enter text..."};
    export let path = "";
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
    async function validateInput(button) {
        if (!button.cancel && (!checkValidFileName(value) || value === undefined || !value)) {
            invalid = true;
            invalidText = `{${value === "" ? "null" : value}} is not a valid file or directory name`;
            return;
        }
        if (!button.cancel && await fs.exists(`${path}${p.sep}${value}`)) {
            invalid = true;
            if (await invoke("is_file", {path: path})) {
                path = path.slice(0, path.indexOf(value));
            }
            invalidText = `${value} in ${path} already exists`;
            return;
        }
        await handleButtonClick(button.action, button.cancel);
    }
</script>
<Popup bind:open={$_openPopup} {title} {description}>
    <Input bind:value bind:invalid label={options.label} placeholder={options.placeholder} hintText={helpText} invalidText={invalidText} />
    <svelte:fragment slot="buttons">
        {#each buttons as button}
            <Button label={button.name} style={button.style} on:click={() => {validateInput(button)}} />
        {/each}
    </svelte:fragment>
</Popup>
