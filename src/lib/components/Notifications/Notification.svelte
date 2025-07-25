<script lang="ts">
    import Error from "../../../assets/icons/error.svelte";
    import ErrorCircle from "../../../assets/icons/error_circle.svelte";
    import Info from "../../../assets/icons/info.svelte";
    import Warning from "../../../assets/icons/warning.svelte";
    import WarningCircle from "../../../assets/icons/warning_circle.svelte";

    // svelte-ignore export_let_unused
    export const id: number = 0;
    export let type = "";
    export let title = "";
    export let message = "";
    export let read = false;
    export let actions = [];

    let notification: HTMLElement | null;
</script>

<div class="info">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <span class="mark-read" on:click|preventDefault={() => {
            read = !read
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
    <div class="notification-info">
        <div class="details">
            <div class="icon">
                {#if type === "Error"}
                    <Error />
                {:else if type === "Warning"}
                    <Warning />
                {:else}
                    <Info />
                {/if}
            </div>
            <div class="title">{type}: {title}</div>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span class="close-button"></span>
    </div>

    <div class="message">{message}</div>

    {#if actions.length > 0}
    <div class="actions">
        {#each actions as action}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
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
    .info {
        color: var(--window-descriptionForeground);
        font-weight: 200;
        font-size: 0.7rem;
        margin-bottom: 0.5rem;
        margin-top: 0.2rem;
        display: flex;
        align-items: center;
        .mark-read {
            text-decoration: underline;
            cursor: pointer;
        }
    }
    .notification {
        display: flex;
        min-height: $notification-height;
        margin-bottom: 0.8rem;
        position: relative;
        flex-direction: column;
        justify-content: center;
        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            :global(svg) {
                height: 22px;
                width: 22px;
            }
        }
        &.warning {
            .icon {
                color: $warning-color;
            }
        }
        &.error {
            .icon {
                color: $error-color;
            }
        }
        &.read {
            color: var(--notification-unreadColor) !important;
            .action-button {
                color: var(--notification-unreadColor);
            }
            .title {
                color: var(--notification-unreadColor) !important;
            }
            :global(.bx--toast-notification__close-button .bx--toast-notification__close-icon) {
                fill: var(--notification-unreadColor);
            }
        }
        &::before {
            position: absolute;
            height: 100%;
            width: 100%;
            border-width: 0 $notification-border-width $notification-border-width $notification-border-width;
            border-style: solid;
            box-sizing: border-box;
            border-color: var(--notification-boxShadow);
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
            overflow: hidden;
            .icon {
                border-radius: 50%;
                min-width: 20px;
                min-height: 20px;
                margin-right: 10px;
            }
            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: var(--window-foreground);
            }
        }
        .message {
            font-size: 15px;
            margin: 0.5rem 0;
            padding: 0 2.4rem;
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
                font-size: 14px;
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
            z-index: 10;
            height: min-content;
            margin-top: 10px;
            &:hover {
                background: var(--window-menuItemHoverBackground);
            }
            &::before {
                content: "\2715";
            }
        }
    }
</style>