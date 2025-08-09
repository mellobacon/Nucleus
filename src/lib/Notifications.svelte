<script lang="ts">
    import { notifications } from "../scripts/notifications";
    import Notification from "./components/Notifications/Notification.svelte";
    import { OverlayScrollbarsComponent } from 'overlayscrollbars-svelte';
</script>
<script lang="ts" context="module">
    export const notificationsMenu = {children: [{name: "test1", shortcut: null, action: null, disabled: false}]};
</script>
<OverlayScrollbarsComponent options={{ scrollbars: { theme: 'editor-scrollbar', autoHide: "leave", autoHideSuspend: true, autoHideDelay: 300 } }} defer class="overlay-scrollbars-notifications">
    <div id="notifications">
        {#if $notifications.length == 0}
            <span class="empty">You have no notifications</span>
        {:else}
        {#each $notifications as notification}
        <Notification 
            id={notification.id} 
            type={notification.type} 
            title={notification.title} 
            message={notification.message} 
            read={notification.read} 
            actions={notification.actions}>
        </Notification>
        {/each}
        {/if}
    </div>
</OverlayScrollbarsComponent>

<style lang="scss">
    :global(.overlay-scrollbars-notifications) {
        height: 100%;
    }
    #notifications {
        padding: 5px 20px;
    }
    .empty {
        color: var(--window-descriptionForeground);
    }
    </style>