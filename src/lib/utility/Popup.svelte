<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let title: string;
    export let description = "";
    export let open = false;

    let popup = null;
    let wrapper = null;

    const dispatch = createEventDispatcher();

    function handleClick(e) 
    {
        if (e.target === wrapper) {
            open = false;   
        }
    }
</script>

{#if open}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="popup-wrapper" bind:this={wrapper} on:click={handleClick}>
        <div class="popup-container" bind:this={popup}>
            <div class="popup-header">
                <span class="title">{title}</span>
            </div>
            <div class="popup-content">
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
    .popup-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        z-index: 3;
    }
    .popup-container {
        position: static;
        min-height: 25%;
        min-width: 45%;
        border-radius: 2px;
    }
    @media(min-width: 42rem) {
        .popup-container {
            position: static;
            width: 84%;
            height: auto;
            max-height: 90%
        }
    }
    @media(min-width: 66rem) {
        .popup-container {
            width: 60%;
            max-height: 84%
        }
    }
    @media(min-width: 82rem) {
        .popup-container {
            width: 48%
        }
    }
    .popup-header {
        display: flex;
        align-items: center;
        padding: 1.5rem 3rem 0.5rem 1rem;
        font-size: 1.25rem;
    }
    .popup-content {
        display: flex;
        padding: 1rem 3rem 0.5rem 1rem;
        flex-direction: column;
        justify-content: center;
        .description {
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
            margin-top: 40px;
            margin-bottom: 30px;
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
