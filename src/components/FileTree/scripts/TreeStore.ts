import { writable } from 'svelte/store';

let treedata = [];
export let filetree = writable(treedata);
export let workspacename = writable("Untitled Workspace");