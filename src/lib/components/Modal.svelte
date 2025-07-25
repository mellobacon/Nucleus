<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import InputModal from "./InputModal.svelte";

    export let title: string;
    export let description = "";
    let open = true;

    let modal = null;
    let overlay = null;

    export let width = 25;
    export let height = 20;

    const dispatch = createEventDispatcher();

    function handleClick(e) 
    {
        if (e.target === overlay) {
            open = false;   
        }
    }
</script>

<script lang="ts" context="module">
    export function toggleInputModal(title: string, description = "") {
        new InputModal({target: document.getElementById("app"), props: {title: title, description: description}});
    }
</script>

{#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-overlay" bind:this={overlay} on:click={handleClick}>
        <div class="modal-container" bind:this={modal} style="min-height: {height}%; min-width: {width}%;">
            <div class="modal-header">
                <span class="title">{title}</span>
            </div>
            <div class="modal-content">
                <p class="description">{description}</p>
                <div class="content">
                    <slot></slot>
                </div>
                <div class="button-group">
                    <slot name="buttons"></slot>
                </div>
            </div>
        </div>
    </div>
{/if}

<style lang="scss">
    .modal-overlay {
        position: fixed;
        top: 2.2rem;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: calc(100vh - 2.2rem);
        z-index: 999;
        background-color: var(--modal-shadow);
    }
    .modal-container {
        position: static;
        margin-top: -4.2rem;
        border-radius: 2px;
        background-color: var(--modal-background);
        color: var(--modal-foreground);
        outline: 1px solid var(--window-borderColor);
    }
    .modal-header {
        display: flex;
        align-items: center;
        padding: 1.5rem 1rem 0.5rem 1rem;
        font-size: 1.25rem;
    }
    .modal-content {
        display: flex;
        padding: 0.5rem 1rem 0.5rem 1rem;
        flex-direction: column;
        justify-content: center;
        .description {
            margin: 0;
            margin-top: -5px;
            font-size: 0.9rem;
        }
        .content {
            width: 100%;
        }
        .button-group {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 10px 0;
            :global(button) {
                min-width: 90px;
                height: 35px;
                border-radius: 2px;
                margin: 0 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                padding: 0 10px;
                font-size: 15px;
            }
        }
    }
</style>
