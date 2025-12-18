// Client-side notifications (in-app + Web Notifications API)

export async function ensureNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  const perm = await Notification.requestPermission();
  return perm === "granted";
}

export function notify(title: string, body?: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

export function scheduleLocalReminders(events: { title: string; at: Date }[]) {
  // Simple client-only reminders while the app is open.
  for (const e of events) {
    const delay = e.at.getTime() - Date.now();
    if (delay > 0 && delay < 1000 * 60 * 60 * 24 * 7) {
      setTimeout(() => notify("Upcoming: " + e.title), delay);
    }
  }
}
