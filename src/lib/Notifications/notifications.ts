import { writable } from "svelte/store";

export enum NotifType {
    Message,
    Warning,
    Error
}
class Notification {
    id;
    type: string;
    title: string;
    message: string;
    read: boolean;
    actions;
    constructor(title, type, read = false, message = "", actions = []) {
        this.title = title;
        this.message = message;
        this.type = getType(type);
        this.read = read;
        this.actions = actions;
    }
}
class ToastNotification extends Notification {
    constructor(title, type, message = "", actions = []) {
        super(title, type, false, message, actions);
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
export const unreadnotifications = writable(false);
export const notifications = writable([]);
export const toasts = writable([]);
let notificationlist: Notification[] = [];
let toastlist: ToastNotification[] = [];

export function addNotification(type: NotifType, title: string, actions: Action[] = [], message = "") {
    let notification = new Notification(title, type, false, message, actions);
    let toast = new ToastNotification(title, type, message, actions);
    notification.id = id;
    toast.id = id;
    notificationlist = [...notificationlist, notification];
    toastlist = [...toastlist, toast];
    notifications.set(notificationlist);
    toasts.set(toastlist);
    updateNotificationStatus();
    id++;
}

export function markAllRead() {
    for (const notification of notificationlist) {
        notification.read = true;
    }
    updateNotificationStatus();
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
    toastlist = [];
    notifications.set(notificationlist);
    toasts.set(toastlist);
    updateNotificationStatus();
}

export function closeNotification(id) {
    notificationlist = notificationlist.filter(n => n.id !== id);
    notifications.set(notificationlist);
    updateNotificationStatus();
}

export function closeToast(id) {
    toastlist = toastlist.filter(n => n.id !== id);
    toasts.set(toastlist);
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
    }
    unreadnotifications.set(unread);
}
