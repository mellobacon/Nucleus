<script lang="ts">
	import Header from "./components/Header/Header.svelte";
	import Sidebar from "./components/Sidebar/Sidebar.svelte";
	import MainContainer from "./components/Content/MainContainer.svelte";
	import "carbon-components-svelte/css/g100.css";
	import { Pane, Splitpanes } from 'svelte-splitpanes';
    import SidebarView from "./components/Sidebar/SidebarView.svelte";
    import { showtabview, sidebartab } from "./components/Sidebar/Sidebar";
</script>

<Header />
<div id="main">
	<Sidebar />
	<Splitpanes theme="editor-pane">
		{#if $showtabview}
		<Pane size={25} snapSize={5}>
			<SidebarView>
				<div class="sidebarheader">
					<span>{$sidebartab.tabname}</span>
				</div>
				<div class="sidebarcontent">
					<svelte:component this={$sidebartab.content}></svelte:component>
				</div>
			</SidebarView>
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
		height: calc(100% - 2rem);
	}
	.sidebarheader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 2rem;
        border-bottom: 1px solid #333;
    }
	.sidebarcontent {
        width: 100%;
        overflow-y: auto;
    }
    .sidebarcontent::-webkit-scrollbar {
		width: 12px;
	}
	.sidebarcontent::-webkit-scrollbar-thumb {
		background-color: #4c4c4c38;;
	}
</style>