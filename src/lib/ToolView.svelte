<script lang="ts">
    export let content = null;
</script>
<div id="toolview">
    <svelte:component this={content}></svelte:component>
</div>

<style lang="scss">
    #toolview {
        height: 100%;
        width: 100%;
        display: flex;
		align-items: center;
		justify-content: center;
    }
</style>