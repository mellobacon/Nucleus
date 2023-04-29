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
        height: 2.5rem;
        margin: 5px;
        border-radius: 3px;
        cursor: pointer;
        :global(svg) {
            width: 22px;
            height: 22px;
        }
    }
</style>
