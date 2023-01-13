import { filetree, workspacename } from "../../FileTree/scripts/TreeStore";
import { data, workspace } from "../../FileTree/scripts/TreeData";
import { addFileTab, addSettingsTab } from "../../Tabs/scripts/Tab";
import { getFile, saveFile, saveFileAs } from "../../../scripts/EditorFile";
import { loadingtree } from "../../FileTree/scripts/TreeData";

export async function addNewFile() {
    await addFileTab();
}
export async function openFile() {
    let path = await getFile();
    if (path === undefined || path === null) return;
    await addFileTab(path);
}

export async function openFolder() {
    let treedata = await data();
    if (treedata === undefined || treedata === null) return;
    filetree.set(treedata);
    workspacename.set(workspace());
    loadingtree.set(false);
    return;
}
export async function saveOpenFile() {
    await saveFile();
}
export async function saveOpenFileAs() {
    await saveFileAs();
}
export function openSettings() {
    addSettingsTab();
}