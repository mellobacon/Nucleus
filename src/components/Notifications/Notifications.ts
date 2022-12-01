import { writable } from "svelte/store";

export enum NotifType {
    Message,
    Warning,
    Error
}
class Notification {
    id;
    type: string;
    message: string;
    read: boolean;
    actions;
    constructor(message, type, read = false, actions = []) {
        this.message = message;
        this.type = getType(type);
        this.read = read;
        this.actions = actions;
    }
}
export class Action {
    label: string;
    action: () => void | null;
    constructor(label, action: () => void | null = null) {
        this.label = label;
        this.action = action;
    }
}

const actions = [
    new Action(" Test Message", () => {
        addNotification(NotifType.Message, "Message notification success");
    }),
    new Action("Test Warning", () => {
        addNotification(NotifType.Warning, "Warning notification success");
    }),
    new Action("Test Error", () => {
        addNotification(NotifType.Error, "Failure or something idk");
    })
]

let id = 0;
export let unreadnotifications = writable(false);
export const notifications = writable([]);
let notificationlist = [];

export function addNotification(type, message, actions = []) {
    let notification = new Notification(message, type, false, actions);
    notification.id = id;
    notificationlist = [...notificationlist, notification];
    notifications.set(notificationlist);
    updateNotificationStatus();
    id++;
}
export function updateReadStatus(id, read) {
    for (const notification of notificationlist) {
        if (notification.id === id) {
            notification.read = read;
            break;
        }
    }
    updateNotificationStatus();
}
export function clearNotifications() {
    notificationlist = [];
    notifications.set(notificationlist);
    updateNotificationStatus();
}
export function closeNotification(id) {
    notificationlist = notificationlist.filter(n => n.id !== id);
    notifications.set(notificationlist);
    updateNotificationStatus();
}
function getType(type: NotifType) {
    switch (type) {
        case NotifType.Message:
            return "Message";
        case NotifType.Warning:
            return "Warning";
        case NotifType.Error:
            return "Error";
        default:
            return "Message";
    }
}
function updateNotificationStatus() {
    let unread = false;
    for (const notification of notificationlist) {
        if (!notification.read) {
            unread = true;
            break;
        }
        else {
            unread = false;
        }
    }
    unreadnotifications.set(unread);
}