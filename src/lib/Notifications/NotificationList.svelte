<script lang="ts">
    import { notifications } from "./notifications";
    import Notification from "./Notification.svelte";
</script>

<div id="notifications">
{#each $notifications as notification}
    <Notification id={notification.id} type={notification.type} message={notification.message} read={notification.read} actions={notification.actions}></Notification>
{/each}
</div>

<style lang="scss">
#notifications {
    height: calc(100% - 1.5rem);
    padding: 5px;
    overflow: auto;
}
</style>