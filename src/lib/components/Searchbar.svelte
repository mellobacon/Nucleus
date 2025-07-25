<script lang="ts">
    import { tooltip } from "../../scripts/tooltip";
    import Search from "../../assets/icons/Search.svelte";

    export let placeholder = "Text";
    export let button = false;
    export let buttonIcon = null;
    export let buttonTitle = "Button";
    export let fluid = false;
    export let height = "";
    export let width = "";
    export let autofocus = false;
</script>
<div class="searchbar" class:fluid style="height: {height}; width: {width}">
    <!-- svelte-ignore a11y-autofocus -->
    <input type="text" placeholder={placeholder} autofocus={autofocus}>
    {#if button}
        <div title={buttonTitle} use:tooltip data-tooltip-top-offset="100" class="button" role="button" tabindex="-1" on:click on:keydown aria-label="button">
            {#if buttonIcon}
                <svelte:component this={Search}></svelte:component>
            {:else}
                {buttonTitle}
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    .searchbar {
        display: flex;
        justify-content: center;
        align-items: center;
        &.fluid {
            width: 100% !important;
        }
        input {
            width: 100%;
            height: 100%;
            outline: 1px solid var(--window-inputBorder);
            font-size: 0.875rem;
        }
        .button {
            background-color: var(--window-inputBackground);
            color: var(--window-inputForeground);
            height: 100%;
            outline: 1px solid var(--window-inputBorder);
            padding: 0 5px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            cursor: pointer;
            &:hover {
                background-color: var(--window-selectItemHoverBackground);
            }
            :global(svg) {
                width: 14px;
                height: 14px;
            }
        }
    }
</style>
