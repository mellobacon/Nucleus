<script lang="ts">
	import Header from "./components/Header/Header.svelte";
	import Sidebar from "./components/Sidebar/Sidebar.svelte";
	import MainContainer from "./components/View/MainView.svelte";
	import "carbon-components-svelte/css/g100.css";
	import { Pane, Splitpanes } from 'svelte-splitpanes';
    import SidebarView from "./components/Sidebar/SidebarView.svelte";
    import { showsidebarview, tool } from "./components/Sidebar/Sidebar";
</script>

<Header />
<div id="main">
	<Sidebar />
	<Splitpanes theme="editor-pane">
		{#if $showsidebarview}
		<Pane size={25} minSize={10}>
			<SidebarView title={$tool.tabname} content={$tool.content}></SidebarView>
		</Pane>
		{/if}
		<Pane>
			<MainContainer />
		</Pane>
	</Splitpanes>
</div>
<style>
	#main {
		display: flex;
	}
</style>