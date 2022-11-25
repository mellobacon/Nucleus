import { filetree, workspacename } from "../../FileTree/scripts/TreeStore";
import { data, workspace } from "../../FileTree/scripts/TreeData";
import { addFileTab } from "../../Tabs/scripts/Tab";
import { getFile, saveFile } from "../../../scripts/EditorFile";

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
    await saveFile();
}