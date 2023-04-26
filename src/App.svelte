<script lang="ts">
    import Header from "./lib/Header.svelte";
    import Sidebar, { showsidebarview, tool} from "./lib/Sidebar.svelte";
	import { Pane, Splitpanes } from 'svelte-splitpanes';
    import SidebarView from "./lib/SidebarView.svelte";
</script>

<Header />
<div id="main">
	<Sidebar />
	<Splitpanes theme="editor-panes">
		<Pane size={25} minSize={10} maxSize={60}></Pane>
		<Pane></Pane>
	</Splitpanes>
</div>
<style>
	#main {
		display: flex;
	}
</style>