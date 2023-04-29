<script lang="ts">
    import Folder from "carbon-icons-svelte/lib/Folder.svelte";
    import SidebarTab from "./SidebarTab.svelte";
    import FileTree from "./FileTree.svelte";

    export let tabs = [
        {id: 0, tabname: "Explorer", icon: Folder, content: FileTree}
    ];
</script>

<div id="sidebar">
    {#each tabs as tab}
        <SidebarTab id={`tool-${tab.id}`} active={$activeid === tab.id} label={tab.tabname} on:click={() => {toggleActive(tab)}}>
            <svelte:component this={tab.icon}/>
        </SidebarTab>
    {/each}

    <div class="divider" />
</div>

<script lang="ts" context="module">
    import { writable } from "svelte/store"; 
    class Tool {
        tabname: string;
        content;
        constructor(tabname: string, content) {
            this.tabname = tabname;
            this.content = content;
        }
    }

    export let activeid = writable(-1);
    let active = -1;
    export let showsidebarview = writable(false);
    export let tool = writable(null);

    export const toggleActive = (tab: { id: any; tabname: any; icon: any, content: any }) => {
        if (active === tab.id) {
            active = -1;
            activeid.set(-1);
            showsidebarview.set(false);
        }
        else {
            activeid.set(tab.id);
            active = tab.id;
            showsidebarview.set(true);
            tool.set(new Tool(tab.tabname, tab.content));
        }
    }
</script>

<style lang="scss">
    #sidebar {
        height: 100%;
        min-width: 3rem;
        display: flex;
        flex-direction: column;
    }
    .divider {
        width: 2.3rem;
        height: .0625rem;
        background-color: #333;
        margin: 0 auto;
    }
</style>