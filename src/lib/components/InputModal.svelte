<script>
    import Button from "./Button.svelte";
    import Input from "./Input.svelte";
    import Modal from "./Modal.svelte";

    export let title;
    export let description;

    let helpText = ""
    let invalidText = "";
</script>
<Modal {title} {description}>
    <Input _class="input" hintText={helpText} invalidText={invalidText} label="Input" labelDirection="left" />
    <svelte:fragment slot="buttons">
        <Button style="accent" label="OK" />
        <Button style="secondary" label="Cancel" />
    </svelte:fragment>
</Modal>

<style lang="scss">
    :global(.input input) {
        height: 25px;
    }
</style>
