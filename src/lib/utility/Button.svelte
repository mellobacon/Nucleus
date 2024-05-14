<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";

    export let label = "Button";
    export let type: "button" | "submit" | "reset" = "button";
    export let style: "primary" | "secondary" | "accent" | "danger" = "primary";
    export let _class = "";

    export let disabled = false;
</script>

<button class="action-button {style} {_class}" type="{type}" disabled={disabled} on:click on:submit>{label}</button>

<style>
.action-button {
    border-radius: 3px;
}
</style>
