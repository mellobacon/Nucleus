<script lang="ts">
    import { clearNotifications, notifications } from "./Notifications";
    import Notification from "./Notification.svelte";
    import {togglePanel} from "../Footer/Footer.svelte";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div id="title">Notifications <span on:click={() => {
        clearNotifications();
        togglePanel();
    }
}>Clear Notifications</span></div>
<div id="notifications">
    {#each $notifications as notification}
        <Notification id={notification.id} type={notification.type} message={notification.message} read={notification.read} actions={notification.actions}></Notification>
    {/each}
</div>

<style lang="scss">
    #notifications {
        width: 100%;
        height: 100%;
        padding: 5px;
        margin-top: 2rem;
    }
    #title {
        min-height: 2rem;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #333;
        padding: 5px;
        position: absolute;
        width: -webkit-fill-available;
        background-color: #161616;
        z-index: 1;
        justify-content: space-between;
        box-shadow: 0px 3px 3px -2px #161616;
        span {
            font-weight: 200;
            font-size: 0.7rem;
            color: #BDD4FF;
            cursor: pointer;
            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>