<script lang="ts">
    import Folder from "carbon-icons-svelte/lib/Folder.svelte";
    import Share from "carbon-icons-svelte/lib/Share.svelte";
    import PasteMyst from "../Misc/PasteMyst.svelte";
    import FileTree from "../FileTree/FileTree.svelte";
    import { activeid, toggleActive } from "./Sidebar";
    import SidebarTab from "./SidebarTab.svelte";

    const tabs = [
        {id: 0, tabname: "Files", icon: Folder, content: FileTree},
        //{id: 1, tabname: "Git", icon: Share, content: "Git"}
    ]
    const exttabs = [
        //{id: 2, tabname: "PasteMyst", icon: PasteMyst, content: "PasteMyst"},
    ];
</script>

<div id="sidebar">
    {#each tabs as tab}
		<SidebarTab id={`tool-${tab.id}`} active={$activeid === tab.id} label={tab.tabname} on:click={() => {toggleActive(tab)}}>
			<svelte:component this={tab.icon}/>
		</SidebarTab>
	{/each}
    <div class="sidebardivider"></div>
    {#each exttabs as tab}
		<SidebarTab id={`tool-${tab.id}`} active={$activeid === tab.id} label={tab.tabname} on:click={() => {toggleActive(tab)}}>
			<svelte:component this={tab.icon}/>
		</SidebarTab>
	{/each}
</div>

<style lang="scss">
    #sidebar {
        height: 100%;
        min-width: 3rem;
        border-right: 1px solid #333;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        :global(svg) {
			width: 24px;
			height: 24px;
		}
    }
    .sidebardivider {
        width: 2rem;
        height: .0625rem;
        background-color: #333;
        margin: 5px 0 5px 0;
        content: '';
    }
</style>
