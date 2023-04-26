<script lang="ts">
    import Header from "./lib/Header.svelte";
    import Sidebar from "./lib/Sidebar.svelte";
	
</script>

<Header />
<div id="main">
	<Sidebar />
</div>
<style>
	#main {
		display: flex;
	}
</style>