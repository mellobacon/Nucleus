import { writable } from 'svelte/store';

let testtree = [
    {id: 0, text:"Empty", path:""},
    {id: 1, text:"Dir1", children: [
        {id: 2, text:"File1"},
        {id: 3, text:"File2.txt"},
    ]},
];
export let filetree = writable(testtree);
export let workspacename = writable("Untitled Workspace");