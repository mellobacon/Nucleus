<script lang="ts">
    import { Tabs, Tab, TabContent } from "carbon-components-svelte";
    import Folder from "carbon-icons-svelte/lib/Folder.svelte";
    import Share from "carbon-icons-svelte/lib/Share.svelte";
    import PasteMyst from "../Misc/PasteMyst.svelte";
    import Tree from "../FileTree/Tree.svelte";
    import { toggleActive } from "./Sidebar";

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

<style>
    #sidebar {
        height: 100%;
        min-width: 3rem;
        border-right: 1px solid #333;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
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
</style>
