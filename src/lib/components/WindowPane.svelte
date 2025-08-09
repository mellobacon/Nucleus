<script lang="ts">
    import Ellipsis from "../../assets/icons/ellipsis.svelte";
    import { type MenuItem } from "../../scripts/Menu";
    import { tooltip } from "../../scripts/tooltip";
    import Menu from "./Menu.svelte";
    import TerminalTabs from "./Tabs/TerminalTabs.svelte";

    type Tool = {
        name: string,
        icon,
        action?: () => void
    }
    export let tools: Tool[] = [];
    export let menu: MenuItem = null;
    export let content = null;
    export let title = "Pane";
    export let ellipsis = false;
    export let bottom = false;
    export let bottomTooltip: "true" | "false" | "none" = "false";

    if (ellipsis) {
        menu.icon = Ellipsis;
    }
</script>

<div class="window-pane" class:bottom >
    <div class="content">
        {#if bottom}
            <TerminalTabs />
        {:else}
        <span class="title">{title}</span>
        <div class="tools" class:bottom>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            {#each tools as tool}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="tool" title={tool.name} on:click={tool.action} use:tooltip data-tooltip-bottom={bottomTooltip} data-tooltip-top-offset="45">
                    <svelte:component this={tool.icon}></svelte:component>
                </div>
            {/each}
            {#if menu}    
                <Menu menu={menu} right />
            {/if}
        </div>
        {/if}
    </div>
    {#if content}
        <svelte:component this={content}></svelte:component>
    {:else if !bottom}
        <p>Panel</p>
    {/if}
</div>

<style lang="scss">
    .window-pane {
        height: calc(100% - 3.2rem);
        &.bottom {
            height: calc(100% - 1.5rem);
            :global(.overlay-scrollbars-tabs.panel) {
                height: 100%;
            }
            .content {
                padding: 0;
            }
        }
        .content {
            height: 100%;
            height: 37px;
            border-bottom: 1px solid var(--window-borderColor);
            display: flex;
            align-items: center;
            padding: 0 10px;
            line-height: normal;
            .title {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                display: flex;
                gap: 5px;
                align-items: center;
                flex-direction: row;
            }
            .tools {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                height: 65%;
                &:not(.bottom) {
                    flex: 1;
                }
                .tool {
                    height: 100%;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 5px;
                    z-index: 10;
                    border-radius: 2px;
                    cursor: pointer;
                    :global(svg) {
                        width: 16px;
                        height: 16px;
                    }
                    &:hover {
                        background-color: var(--header-buttonHoverBackground);
                    }
                }
            }
        }
    }
</style>