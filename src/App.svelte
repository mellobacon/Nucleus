<script lang="ts">
	import Header from "./components/Header/Header.svelte";
	import Sidebar from "./components/Sidebar/Sidebar.svelte";
	import MainContainer from "./components/Content/MainContainer.svelte";
	import "carbon-components-svelte/css/g100.css";
</script>

<Header />
<div id="main">
	<Sidebar />
	<MainContainer />
</div>
<style>
	#main {
		display: flex;
		height: calc(100% - 2rem);
	}
</style>