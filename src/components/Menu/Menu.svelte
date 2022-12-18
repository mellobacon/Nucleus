<script lang="ts">
    import { OverflowMenu, OverflowMenuItem } from "carbon-components-svelte";
    import "carbon-components-svelte/css/g100.css";
    export let name: string;
    export let options = [];
</script>

<OverflowMenu style="width: auto;" size="sm">
    <div slot="menu" style="padding: 0 1rem; color: white;">{name}</div>
    {#each options as menuoption}
        <OverflowMenuItem on:click={menuoption.onclick} hasDivider={menuoption.divider} disabled={menuoption.disabled}>
            <span class="option_name">{menuoption.option}</span>
            {#if menuoption.shortcut}
                <span class="shortcut">{menuoption.shortcut}</span>
            {/if}
        </OverflowMenuItem>
    {/each}
</OverflowMenu>
<style>
	.shortcut {
		color: #8c8c8c;
		margin-left: 50px;
	}
</style>