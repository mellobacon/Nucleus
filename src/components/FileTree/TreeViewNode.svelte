<script context="module">
  export function computeTreeLeafDepth(node) {
    let depth = 0;

    if (node == null) return depth;

    let parentNode = node.parentNode;

    while (parentNode != null && parentNode.getAttribute("role") !== "tree") {
      parentNode = parentNode.parentNode;
      if (parentNode.tagName === "LI") depth++;
    }

    return depth;
  }

  function findParentTreeNode(node) {
    if (node.classList.contains("bx--tree-parent-node")) return node;
    if (node.classList.contains("bx--tree")) return null;
    return findParentTreeNode(node.parentNode);
  }
</script>

<script>
  /**
   * @typedef {string | number} TreeNodeId
   */

  export let leaf = false;

  /** @type {TreeNodeId} */
  export let id = "";
  export let name = "";
  export let disabled = false;
  export let path = "";

  /**
   * Specify the icon to render
   * @type {typeof import("svelte").SvelteComponent}
   */
  export let icon = undefined;

  import { afterUpdate, getContext } from "svelte";
  import { addTab } from "../Content/Editor/Tabs";
  import RenameModel from "../Modal/RenameModel.svelte";
  import LeafNodeMenu from "./LeafNodeMenu.svelte";

  let ref = null;
  let refLabel = null;
  let prevActiveId = undefined;

  const { activeNodeId, selectedNodeIds, clickNode, selectNode, focusNode } =
    getContext("TreeView");
  const offset = () =>
    computeTreeLeafDepth(refLabel) + (leaf && icon ? 2 : 2.5);

  afterUpdate(() => {
    if (id === $activeNodeId && prevActiveId !== $activeNodeId) {
      if (!$selectedNodeIds.includes(id)) selectNode(node);
    }

    prevActiveId = $activeNodeId;
  });

  $: node = { id, name: name, expanded: false, leaf, path };
  $: if (refLabel) {
    refLabel.style.marginLeft = `-${offset()}rem`;
    refLabel.style.paddingLeft = `${offset()}rem`;
  }

  let open = false;
</script>

<li
  bind:this={ref}
  role="treeitem"
  {id}
  tabindex={disabled ? undefined : -1}
  aria-current={id === $activeNodeId || undefined}
  aria-selected={disabled ? undefined : $selectedNodeIds.includes(id)}
  aria-disabled={disabled}
  class:bx--tree-node={true}
  class:bx--tree-leaf-node={true}
  class:bx--tree-node--active={id === $activeNodeId}
  class:bx--tree-node--selected={$selectedNodeIds.includes(id)}
  class:bx--tree-node--disabled={disabled}
  class:bx--tree-node--with-icon={icon}
  on:click|stopPropagation={() => {
    if (disabled) return;
    clickNode(node);
  }}
  on:dblclick={async () => {
    await addTab(path);
  }}
  on:keydown={(e) => {
    if (
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "F2"
    ) {
      e.stopPropagation();
    }
    if (e.key === "ArrowLeft") {
      const parentNode = findParentTreeNode(ref.parentNode);
      if (parentNode) parentNode.focus();
    }
    if (e.key === "F2") {
      e.preventDefault();
      open = true;
    }
  }}
  on:focus={() => {
    focusNode(node);
  }}
>
  <div bind:this={refLabel} class:bx--tree-node__label={true}>
    <svelte:component this={icon} class="bx--tree-node__icon" />
    {name}
  </div>
</li>
<LeafNodeMenu target={ref} filename={name} filepath={path}></LeafNodeMenu>
<RenameModel bind:open bind:filename={name} bind:path={path} />

<style>
  :global(.bx--tree-node__label) {
    white-space: nowrap;
    cursor: pointer;
  }
</style>