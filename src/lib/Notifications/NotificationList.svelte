<script lang="ts">
    import { notifications } from "./notifications";
    import Notification from "./Notification.svelte";

    export let hidden = false;
</script>

<div id="notifications" class:hidden>
{#if $notifications.length == 0}
    <span class="empty">You have no notifications</span>
{:else}
{#each $notifications as notification}
    <Notification id={notification.id} type={notification.type} title={notification.title} message={notification.message} read={notification.read} actions={notification.actions}></Notification>
{/each}
{/if}
</div>

<style lang="scss">
#notifications {
    height: calc(100% - 1.5rem);
    padding: 5px;
    overflow: auto;
}
.empty {
    color: #8c8c8c;
}
.hidden {
    display: none;
}
</style>