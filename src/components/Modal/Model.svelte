<script lang="ts">
    import { Modal } from "carbon-components-svelte";
    export let open = false;
    export let heading = "";
    export let description = "";
    export let buttons = [];
    export let size: "xs" | "sm" | "lg" = undefined;
</script>

<Modal
    preventCloseOnClickOutside
    bind:open
    modalHeading={heading}
    size={size}
    on:open
    on:close
    passiveModal
>
    <div class="modelcontent">
        <div class="description">
            <p>{description}</p>
        </div>
        <div id="content">
            <slot></slot>
        </div>
        <div class="buttongroup">
            {#each buttons as button}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="button" class:disabled={button.disabled} class:danger={button.danger} on:click={button.action} title={button.title}>{button.name}</div>
            {/each}
        </div>
    </div>
</Modal>

<style lang="scss">
    .modelcontent {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .description {
        width: 100%;
    }
    #content {
        display: flex;
    }
    .button {
        min-width: 80px;
        height: 35px;
        border-radius: 1px;
        margin: 0 5px 0 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #2276b2;
        color: #f9f9f9;
        cursor: pointer;
        padding: 0 5px;
        &.danger {
            background-color: #b22222 !important;
            &:hover {
                background-color: #8a1919 !important;
            }
        }
    }
    .button:hover {
        background-color: #195b8a;
    }
    .buttongroup {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 40px;
    }
    .disabled {
        background-color: #a9a9a9;
        color: #7a7a7a;
        cursor: not-allowed;
    }
</style>
