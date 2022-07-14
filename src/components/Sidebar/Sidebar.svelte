<script lang="ts">
    import { Tabs, Tab, TabContent } from "carbon-components-svelte";
    import Folder from "carbon-icons-svelte/lib/Folder.svelte";
    import Share from "carbon-icons-svelte/lib/Share.svelte";
    import PasteMyst from "../Misc/PasteMyst.svelte";
    import SidebarView from "./SidebarView.svelte";
    import Tree from "../FileTree/Tree.svelte";

    let active = false;
    let activeid = -1;
    let tabname = "";
    let content = null;
    let show = false;
    const toggleActive = (tab) => {
        active = !active;
        if (activeid === tab.id) {
            activeid = -1;
            document.getElementById(`sidetab-${tab.id}`).parentElement.classList.remove("bx--tabs__nav-item--selected");
            show = false;
        }
        else {
            activeid = tab.id;
            document.getElementById(`sidetab-${tab.id}`).parentElement.classList.add("bx--tabs__nav-item--selected");
            tabname = tab.tabname;
            content = tab.content;
            show = true;
        }
    }
    const tabs = [
        {id: 0, tabname: "Files", icon: Folder, content: Tree},
        //{id: 1, tabname: "Git", icon: Share, content: "Git"}
    ]
    const exttabs = [
        //{id: 2, tabname: "PasteMyst", icon: PasteMyst, content: "PasteMyst"},
    ];
</script>

<div id="sidebar">
    <Tabs selected={-1} type="container">
        {#each tabs as tab}
            <Tab id={`sidetab-${tab.id.toString()}`} on:click={() => {toggleActive(tab)}}>
                <svelte:component this={tab.icon}></svelte:component>
            </Tab>
        {/each}
        <div class="sidebardivider"></div>
        {#each exttabs as tab}
            <Tab id={`sidetab-${tab.id.toString()}`} on:click={() => {toggleActive(tab)}}>
                <svelte:component this={tab.icon}></svelte:component>
            </Tab>
        {/each}
    </Tabs>
</div>
<SidebarView show={show}>
    <div class="sidebarheader">
        <span>{tabname}</span>
    </div>
    <div class="sidebarcontent">
        <svelte:component this={content}></svelte:component>
    </div>
</SidebarView>

<style>
    #sidebar {
        height: 100%;
        width: 3rem;
        border-right: 1px solid #333;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
    }
    .sidebarheader {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 2rem;
        border-bottom: 1px solid #333;
    }
    .sidebardivider {
        width: 2rem;
        height: .0625rem;
        background-color: #333;
        margin: 5px 0 5px 0;
        content: '';
    }
    :global(.bx--tabs__nav-link svg) {
        width: 24px;
        height: 24px;
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
