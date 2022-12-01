<script lang="ts">
    import { NotificationButton } from "carbon-components-svelte";
    import { getTime } from "../../config/config";
    import { closeNotification, updateReadStatus } from "./Notifications";

    export let id;
    export let type = "";
    export let message = "";
    export let read = false;
    export let actions = [];

    let notification;
</script>
<div class="info">
    <span>{getTime()}</span>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span class="mark-read" on:click|preventDefault={() => {
            read = !read
            updateReadStatus(id, read); 
        }
    }>
        {#if read}
            Mark as unread
        {:else}
            Mark as read
        {/if}
    </span>
</div>
<div bind:this={notification} class="notification" class:error={type === "Error"} class:warning={type === "Warning"} class:read>
    <div class="details">
        <div class="icon"></div>
        <div class="message">{type}: {message}</div>
    </div>
    <div class="actions">
        {#each actions as action}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="action-button" on:click={action.action}>{action.label}</div>
        {/each}
    </div>
    
    <div class="close-button">
        <NotificationButton on:click={() => {closeNotification(id)}}></NotificationButton>
    </div>
</div>

<style lang="scss">
    $notification-height: 3rem;
    $notification-border-width: 1px;
    $error-color: #c02b2b;
    $warning-color: #ffeb10;
    $default-color: #4589ff;
    .info {
        color: #6d6d6d;
        font-weight: 200;
        font-size: 0.7rem;
        margin-bottom: 0.5rem;
        margin-top: 0.8rem;
        display: flex;
        align-items: center;
        span {
            margin: 0 5px;
        }
        .mark-read {
            text-decoration: underline;
            cursor: pointer;
            &:hover {
                color: #939393;
            }
        }
    }
    .notification {
        display: flex;
        min-height: $notification-height;
        background-color: #1f1f1f;
        margin-bottom: 0.8rem;
        position: relative;
        border-top: 3px solid $default-color;
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
        &.read {
            border-top-color: #333;
            color: #838383;
            .icon {
                background-color: #333 !important;
            }
            .action-button {
                color: #bdd4ff75 !important;
            }
            :global(.bx--toast-notification__close-button .bx--toast-notification__close-icon) {
                fill: #bdd4ff75 !important;
            }
        }
        &::before {
            position: absolute;
            height: 100%;
            width: 100%;
            border-width: 0 $notification-border-width $notification-border-width $notification-border-width;
            border-style: solid;
            box-sizing: border-box;
            border-color: #333;
            content: "";
        }
        .details {
            display: flex;
            margin: 0 0.5rem;
            position: relative;
            top: -1px;
            align-items: center;
            .icon {
                border-radius: 50%;
                background-color: $default-color;
                width: 20px;
                height: 20px;
                margin-right: 10px;
            }
        }
        .actions {
            display: flex;
            margin: 0 0.5rem;
            position: relative;
            top: -1px;
            align-items: center;
            .action-button {
                display: flex;
                justify-content: center;
                align-items: center;
                color: #BDD4FF;
                cursor: pointer;
                &:nth-child(2) {
                    margin: 0 5px;
                }
                &:hover {
                    text-decoration: underline;
                }
            }
        }
        .close-button {
            flex-grow: 1;
            :global(.bx--toast-notification__close-button .bx--toast-notification__close-icon) {
                fill: #ffffff;
                cursor: pointer;
                z-index: 1;
            }
        }
    }
</style>