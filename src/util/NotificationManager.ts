export default class NotificationManager {
  static instance = new NotificationManager();

  permission = Notification.permission === "granted";

  constructor() {
    if (!this.permission && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        this.permission = permission === "granted";
      });
    }
  }

  notify(title: string, options: NotificationOptions = {}) {
    if (this.permission) {
      new Notification(title, options);
    }
  }
}
