<script lang="ts">
  /**
   * @typedef {string | number} TreeNodeId
   * @typedef {{ id: TreeNodeId; name: string; icon?: typeof import("svelte").SvelteComponent; disabled?: boolean; expanded?: boolean; path?: string; }} TreeNode
   * @event {TreeNode & { expanded: boolean; leaf: boolean; }} select
   * @event {TreeNode & { expanded: boolean; leaf: boolean; }} toggle
   * @event {TreeNode & { expanded: boolean; leaf: boolean; }} focus
   */

  /**
   * Provide an array of children nodes to render
   * @type {Array<TreeNode & { children?: TreeNode[] }>}
   */
  export let children = [];

  /**
   * Set the current active node id
   * Only one node can be active
   * @type {TreeNodeId}
   */
  export let activeId = "";

  /**
   * Set the node ids to be selected
   * @type {ReadonlyArray<TreeNodeId>}
   */
  export let selectedIds = [];

  /**
   * Set the node ids to be expanded
   * @type {ReadonlyArray<TreeNodeId>}
   */
  export let expandedIds = [];

  /**
   * Specify the TreeView size
   * @type {"default" | "compact"}
   */
  export let size = "default";

  /** Specify the label text */
  export let labelText = "";

  /** Set to `true` to visually hide the label text */
  export let hideLabel = false;

  export let dblclick = false;

  export let isFileTree = false;

  /**
   * Programmatically expand all nodes
   * @type {() => void}
   */
  export function expandAll() {
    expandedIds = [...nodeIds];
  }

  /**
   * Programmatically collapse all nodes
   * @type {() => void}
   */
  export function collapseAll() {
    expandedIds = [];
  }

  import { createEventDispatcher, setContext, onMount } from "svelte";
  import { writable } from "svelte/store";
  import TreeViewNodeList from "./TreeViewNodeList.svelte";

  const dispatch = createEventDispatcher();
  const labelId = `label-${Math.random().toString(36)}`;
  const activeNodeId = writable(activeId);
  const selectedNodeIds = writable(selectedIds);
  const expandedNodeIds = writable(expandedIds);

  let ref = null;
  let treeWalker = null;

  setContext("TreeView", {
    activeNodeId,
    selectedNodeIds,
    expandedNodeIds,
    isFileTree,
    clickNode: (node) => {
      activeId = node.id;
      selectedIds = [node.id];
      dispatch("select", node);
    },
    selectNode: (node) => {
      selectedIds = [node.id];
    },
    rightClickNode: (node) => {
      dispatch("rightclick", node);
    },
    expandNode: (node, expanded) => {
      if (expanded) {
        expandedIds = [...expandedIds, node.id];
      } else {
        expandedIds = expandedIds.filter((_id) => _id !== node.id);
      }
    },
    focusNode: (node) => dispatch("focus", node),
    toggleNode: (node) => dispatch("toggle", node),
  });

  onMount(() => {
    const firstFocusableNode = ref.querySelector(
      "li.bx--tree-node:not(.bx--tree-node--disabled)"
    );

    if (firstFocusableNode != null) {
      firstFocusableNode.tabIndex = "0";
    }
  });

  /**
   * @param {Array<TreeNode & { children?: TreeNode[] }>} children
   */
  function traverse(children) {
    let nodes = [];

    children.forEach((node) => {
      nodes.push(node);

      if (Array.isArray(node.children)) {
        nodes = [...nodes, ...traverse(node.children)];
      }
    });

    return nodes;
  }

  $: nodes = traverse(children);
  $: nodeIds = nodes.map((node) => node.id);
  $: activeNodeId.set(activeId);
  $: selectedNodeIds.set(selectedIds);
  $: expandedNodeIds.set(expandedIds);
  $: if (ref) {
    treeWalker = document.createTreeWalker(ref, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node: Element) => {
        if (node.classList.contains("bx--tree-node--disabled"))
          return NodeFilter.FILTER_REJECT;
        if (node.matches("li.bx--tree-node")) return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_SKIP;
      },
    });
  }
</script>

{#if !hideLabel}
  <!-- svelte-ignore a11y-label-has-associated-control -->
  <label id={labelId} class:bx--label={true}>
    <slot name="labelText">{labelText}</slot>
  </label>
{/if}

<ul
  {...$$restProps}
  role="tree"
  bind:this={ref}
  class:bx--tree={true}
  class:bx--tree--default={size === "default"}
  class:bx--tree--compact={size === "compact"}
  aria-label={hideLabel ? labelText : undefined}
  aria-labelledby={!hideLabel ? labelId : undefined}
  aria-multiselectable={selectedIds.length > 1 || undefined}
  on:keydown
>
  <TreeViewNodeList root {dblclick} {children} />
</ul>
