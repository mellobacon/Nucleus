<script lang="ts">
    export let label = "Button";
    export let type: "button" | "submit" | "reset" = "button";
    export let style: "primary" | "secondary" | "accent" | "danger" | "outline" = "primary";
    export let icon = null;
    export let _class = "";

    export let disabled = false;
</script>

<button class="action-button {style} {_class}" type="{type}" disabled={disabled} on:click on:submit>
    {#if icon}
        <svelte:component this={icon}></svelte:component>
    {/if}
    {label}
</button>

<style lang="scss">
.action-button {
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    :global(svg) {
        width: 22px;
        height: 22px;
    }
    &.primary {
        background-color: var(--window-buttonBackground);
        color: var(--window-buttonForeground);
        &:hover {
            background-color: var(--window-buttonHoverBackground);
            color: var(--window-buttonHoverForeground);
        }
    }
    &.secondary {
        background-color: var(--window-buttonSecondaryBackground);
        color: var(--window-buttonSecondaryForeground);
        &:hover {
            background-color: var(--window-buttonSecondaryHoverBackground);
            color: var(--window-buttonSecondaryHoverForeground);
        }
    }
    &.accent {
        background-color: var(--window-buttonAccentBackground);
        color: var(--window-buttonAccentForeground);
        &:hover {
            background-color: var(--window-buttonAccentHoverBackground);
            color: var(--window-buttonAccentHoverForeground);
        }
    }
    &.danger {
        background-color: var(--window-buttonDangerBackground);
        color: var(--window-buttonDangerForeground);
        &:hover {
            background-color: var(--window-buttonDangerHoverBackground);
            color: var(--window-buttonDangerHoverForeground);
        }
    }
    &.outline {
        outline: 1px solid var(--window-buttonSecondaryBackground);
        color: var(--window-buttonSecondaryForeground);
        &:hover {
            background-color: var(--window-buttonSecondaryBackground);
        }
    }
    &:focus {
        outline: 1px solid;
        outline-offset: 0px;
    }
}
</style>
