<script>
  /**
   * @typedef {{ id: string; name: string; disabled?: boolean; expanded?: boolean; path?: string; }} TreeNode
   */

  /** @type {Array<TreeNode & { children?: TreeNode[] }>} */
  export let children = [];
  export let expanded = false;
  export let root = false;
  export let isroot = false;

  export let id = "";
  export let name = "";
  export let disabled = false;
  export let dblclick = false;
  export let path = "";

  /**
   * Specify the icon to render
   * @type {typeof import("svelte").SvelteComponent}
   */
  export let icon = undefined;

  import { afterUpdate, getContext } from "svelte";
  import CaretDown from "carbon-icons-svelte/lib/CaretDown.svelte";
  import TreeViewNode, { computeTreeLeafDepth } from "./TreeViewNode.svelte";
    import ParentNodeMenu from "./ParentNodeMenu.svelte";
  

  let ref = null;
  let refLabel = null;
  let prevActiveId = undefined;

  const {
    isFileTree,
    activeNodeId,
    selectedNodeIds,
    expandedNodeIds,
    clickNode,
    rightClickNode,
    selectNode,
    expandNode,
    focusNode,
    toggleNode,
  } = getContext("TreeView");

  const offset = () => {
    const depth = computeTreeLeafDepth(refLabel);

    if (parent) return depth + 1;
    if (icon) return depth + 2;
    return depth + 2.5;
  };

  afterUpdate(() => {
    if (id === $activeNodeId && prevActiveId !== $activeNodeId) {
      if (!$selectedNodeIds.includes(id)) selectNode(node);
    }

    prevActiveId = $activeNodeId;
  });

  $: parent = Array.isArray(children);
  $: node = { id, name, expanded, leaf: !parent, path };
  $: if (refLabel) {
    refLabel.style.marginLeft = `-${offset()}rem`;
    refLabel.style.paddingLeft = `${offset()}rem`;
  }
  $: expanded = $expandedNodeIds.includes(id);
  let contextmenu = false;
</script>

{#if root}
  {#each children as child (child.id)}
    {#if Array.isArray(child.children)}
      <svelte:self {dblclick} isroot={root} {...child} />
    {:else}
      <TreeViewNode parentnode={node} leaf {dblclick} {...child} />
    {/if}
  {/each}
{:else}
  <li
    bind:this={ref}
    role="treeitem"
    {id}
    title={path}
    tabindex={disabled ? undefined : -1}
    aria-current={id === $activeNodeId || undefined}
    aria-selected={disabled ? undefined : $selectedNodeIds.includes(id)}
    aria-disabled={disabled}
    class:root={isroot}
    class:bx--tree-node={true}
    class:bx--tree-parent-node={true}
    class:bx--tree-node--active={id === $activeNodeId}
    class:bx--tree-node--selected={$selectedNodeIds.includes(id)}
    class:bx--tree-node--disabled={disabled}
    class:bx--tree-node--with-icon={icon}
    aria-expanded={expanded}
    on:keydown={(e) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        e.stopPropagation();
      }
      if (parent && e.key === "ArrowLeft") {
        expanded = false;
        expandNode(node, false);
        toggleNode(node);
      }
      if (parent && e.key === "ArrowRight") {
        if (expanded) {
          ref.lastChild.firstElementChild?.focus();
        } else {
          expanded = true;
          expandNode(node, true);
          toggleNode(node);
        }
      }
    }}
    on:focus={() => {
      focusNode(node);
    }}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class:bx--tree-node__label={true} bind:this={refLabel} 
      on:click={() => {
        if (disabled) return;
        expanded = !expanded;
        expandNode(node, expanded);
        toggleNode(node);
      }}
      on:mousedown={(e) => {
        if (disabled) return;
        if (e.button === 2) {
          selectNode(node);
          rightClickNode(node);
          if (isFileTree) contextmenu = true;
        }
      }}
      >
      <span class:bx--tree-parent-node__toggle={true} {disabled}>
        <CaretDown
          class="bx--tree-parent-node__toggle-icon {expanded &&
            'bx--tree-parent-node__toggle-icon--expanded'}"
        />
      </span>
      <span class:bx--tree-node__label__details={true}>
        <svelte:component this={icon} class="bx--tree-node__icon" />
        {name}
      </span>
    </div>
    {#if expanded}
      <ul role="group" class:bx--tree-node__children={true}>
        {#each children as child (child.id)}
          {#if Array.isArray(child.children)}
            <svelte:self {dblclick} {...child} />
          {:else}
            <TreeViewNode parentnode={node} leaf {dblclick} {...child} />
          {/if}
        {/each}
      </ul>
    {/if}
  </li>
{/if}

{#if contextmenu}
<ParentNodeMenu target={[refLabel]} children={children} filename={name} filepath={path}></ParentNodeMenu>
{/if}

<style>
  .root > .bx--tree-node__label {
		font-weight: bold;
	}
</style>