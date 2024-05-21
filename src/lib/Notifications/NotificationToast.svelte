<script lang="ts">
    import { onMount } from "svelte";
    import { closeToast } from "./notifications";
    import { fade } from "svelte/transition";

    export let id: number;
    export let type = "";
    export let title = "";
    export let message = "";
    export let actions = [];

    let notification: HTMLElement | null;

    onMount(() => {
        let timer = setTimeout(() => {
            notification.remove();
            clearTimeout(timer);
        }, 1500000)
        return () => {
            clearTimeout(timer)
        }
    })
</script>

<div bind:this={notification} class="notification-toast" class:error={type === "Error"} class:warning={type === "Warning"} transition:fade={{ duration: 150 }}>
    <div class="notification-info">
        <div class="details">
            <div class="icon"></div>
            <div class="title">{type}: {title}</div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span class="close-button" on:click={() => {closeToast(id)}}></span>
    </div>

    <div class="message">{message}</div>

    {#if actions.length > 0}
    <div class="actions">
        {#each actions as action}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="action-button" on:click={action.action}>{action.label}</div>
        {/each}
    </div>
    {/if}
</div>

<style lang="scss">
    $notification-height: 3rem;
    $notification-border-width: 1px;
    $error-color: #c02b2b;
    $warning-color: #ffeb10;
    .notification-toast {
        display: flex;
        min-height: $notification-height;
        margin-bottom: 0.8rem;
        position: relative;
        flex-direction: column;
        justify-content: center;
        z-index: 10;
        &.warning {
            border-top: 3px solid $warning-color;
            .icon {
                background-color: $warning-color !important;
            }
        }
        &.error {
            border-top: 3px solid $error-color;
            .icon {
                background-color: $error-color !important;
            }
        }
        &::before {
            position: absolute;
            height: 100%;
            width: 100%;
            border-width: 0 $notification-border-width $notification-border-width $notification-border-width;
            border-style: solid;
            box-sizing: border-box;
            content: "";
        }
        .notification-info {
            display: flex;
            justify-content: space-between;
            min-height: 3rem;
        }
        .details {
            display: flex;
            margin: 0 0.5rem;
            position: relative;
            top: -1px;
            align-items: center;
            .icon {
                border-radius: 50%;
                min-width: 20px;
                min-height: 20px;
                margin-right: 10px;
            }
        }
        .message {
            font-size: 15px;
            color: #6d6d6d;
            margin: 0.5rem 0;
            margin-left: 2.4rem;
            margin-top: -0.5rem;
        }
        .actions {
            display: flex;
            margin: 0 0.5rem;
            position: relative;
            top: -1px;
            align-items: center;
            margin-left: 2.4rem;
            margin-bottom: 0.5rem;
            .action-button {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                &:nth-child(2) {
                    margin: 0 0.6rem;
                }
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        .close-button {
            font-size: 12px;
            padding: 0 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
            margin: 0 0.5rem;
            cursor: pointer;
            &::before {
                content: "\2715";
            }
            z-index: 10;
        }
    }
</style>