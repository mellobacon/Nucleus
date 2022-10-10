<script lang="ts">
	let sidebar: HTMLElement;
</script>
<div id="sidebarview" bind:this={sidebar}>
	<slot></slot>
</div>

<style>
    #sidebarview {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>