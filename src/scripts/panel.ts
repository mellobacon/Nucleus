import { get, writable } from "svelte/store";
import { paneBottom, paneLeft, paneRight, toggleBottomPanel, toggleLeftPanel, toggleRightPanel } from "../config/configStore";
import Notifications, { notificationsMenu } from "../lib/Notifications.svelte";
import { terminalMenu } from "../lib/components/Terminal.svelte";
import FileTree, { fileTreetoolbar } from "../lib/components/FileTree.svelte";
import SourceControl, { sourceControlMenu } from "../lib/SourceControl.svelte";

const panels = new Map();

export function initPanels() {
    panels.set("Notifications", {title: "Notifications", content: Notifications, ellipsis: true, menu: notificationsMenu});
    panels.set("Terminal", {title: "Terminal", bottom: true, ellipsis: true, menu: terminalMenu});
    panels.set("Source Control", {title: "Source Control", content: SourceControl, ellipsis: true, menu: sourceControlMenu});
    panels.set("File Explorer", {title: "File Explorer", content: FileTree, tools: fileTreetoolbar});
}

export enum PanelDirection {
    Bottom,
    Left,
    Right
}

export const leftPanel: any = writable({});
export const rightPanel: any = writable({});
export const bottomPanel: any = writable({});

export function openPanel(name: string, direction: PanelDirection) {
    switch (direction) {
        case PanelDirection.Left:
            if (get(leftPanel) && get(leftPanel) === panels.get(name)) {
                toggleLeftPanel();
                break;
            }
            leftPanel.set(panels.get(name));
            paneLeft.set(true)
            break;
        case PanelDirection.Right:
            if (get(rightPanel) && get(rightPanel) === panels.get(name)) {
                toggleRightPanel();
                break;
            }
            rightPanel.set(panels.get(name));
            paneRight.set(true)
            break;
        case PanelDirection.Bottom:
            if (get(bottomPanel) && get(bottomPanel) === panels.get(name)) {
                toggleBottomPanel();
                break;
            }
            bottomPanel.set(panels.get(name));
            paneBottom.set(true)
            break;
    }
}


