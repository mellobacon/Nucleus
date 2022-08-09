import { writable } from 'svelte/store';

let testtree = [
    {id: 0, name:"Empty", path:"testpath/"},
    {id: 1, name:"Dir1", children: [
        {id: 2, name:"File1", path: "/file1.path"},
        {id: 3, name:"File2.txt", path:"testpath/file2.txt"},
    ], path: "testpath/Dir1/"},
];
export let filetree = writable(testtree);
export let workspacename = writable("Untitled Workspace");