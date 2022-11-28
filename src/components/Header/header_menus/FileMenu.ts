import { filetree, workspacename } from "../../FileTree/scripts/TreeStore";
import { data, workspace } from "../../FileTree/scripts/TreeData";
import { addFileTab, addSettingsTab } from "../../Tabs/scripts/Tab";
import { getFile, saveFile, saveFileAs } from "../../../scripts/EditorFile";

export async function addNewFile() {
    await addFileTab();
}
export async function openFile() {
    let path = await getFile();
    if (path === undefined) return;
    await addFileTab(path);
}
export async function openFolder() {
    let treedata = await data();
    if (treedata === undefined) return;
    filetree.set(treedata);
    workspacename.set(workspace());
}
export async function saveOpenFile() {
    await saveFile()
}
export async function saveOpenFileAs() {
    await saveFileAs();
}
export function openSettings() {
    addSettingsTab();
}