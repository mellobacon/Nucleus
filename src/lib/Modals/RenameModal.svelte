<script lang="ts">
    import { onMount } from "svelte";
    import Input from "../utility/Input.svelte";
    import Popup from "../utility/Popup.svelte";

    export let title;
    export let buttons;
    export let description = "";
    export let options = {label: "Name: ", placeholder: "Enter text..."};
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
    <div class="rename-input">
        <Input bind:value label={"File Name"} placeholder={"Enter name..."} />
        <div class="divider"></div>
        <Input label={"File Type"} placeholder={"-"} readonly _class="ext" />
    </div>
    <svelte:fragment slot="buttons">
        {#each buttons as button}
            <button on:click={async () => {await handleButtonClick(button.action)}}>{button.name}</button>
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