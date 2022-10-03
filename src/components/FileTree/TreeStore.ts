import { writable } from 'svelte/store';

let testtree = [

];
export let filetree = writable(testtree);
export let workspacename = writable("Untitled Workspace");