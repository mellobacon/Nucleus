<script lang="ts">
    import { toasts } from "./notifications";
    import NotificationToast from "./NotificationToast.svelte";
</script>
<div id="notificationtoasts">
    {#each $toasts as toast}
        <NotificationToast id={toast.id} type={toast.type} title={toast.title} message={toast.message} actions={toast.actions} />
    {/each}
</div>

<style lang="scss">
    #notificationtoasts {
        width: 25rem;
        height: calc(100% - 2rem);
        position: absolute;
        bottom: 0;
        padding: 10px 0;
        right: 1rem;
        box-sizing: border-box;
        display: flex;
        justify-content: flex-end;
        flex-direction: column;
        padding-bottom: 1.5rem;
    }
</style>
