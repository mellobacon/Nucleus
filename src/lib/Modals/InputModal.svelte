<script lang="ts">
    import { onMount } from "svelte";
    import Input from "../utility/Input.svelte";
    import Popup from "../utility/Popup.svelte";

    export let title;
    export let buttons;
    export let description = "";
    export let options = {label: null, placeholder: "Enter text..."};
    export let open = false;


    onMount(() => {
        if (!options.placeholder) {
            options.placeholder = "Enter text..."
        }
    })

    let value = "";
    async function handleButtonClick(buttonAction) {
        await buttonAction(value);
        open = false;
    }

</script>
<Popup bind:open {title} {description}>
    <Input bind:value label={options.label} placeholder={options.placeholder} />
    <svelte:fragment slot="buttons">
        {#each buttons as button}
            <button on:click={async () => {await handleButtonClick(button.action)}}>{button.name}</button>
        {/each}
    </svelte:fragment>
</Popup>