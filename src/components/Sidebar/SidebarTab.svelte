<script lang="ts">
    export let id:string;
    export let active = false;
    export let label: string;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div {id} class="sidebar-tab" class:active title={label} on:click>
    <slot></slot>
</div>

<style lang="scss">
    .sidebar-tab {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 3rem;
        cursor: pointer;
        &.active {
            box-shadow: inset -2px 0px 0 0 #4589ff;
        }
        &:hover {
            background-color: #363636;
        }
    }
</style>