import type { NotificationPayload } from '../types';

export const notificationService = {
  isSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator
    );
  },

  permission(): NotificationPermission {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  },

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    if (Notification.permission === 'granted') return 'granted';
    return Notification.requestPermission();
  },

  /**
   * Show a notification through the service worker. Falls back to a
   * page-level Notification when SW isn't ready yet.
   */
  async show(payload: NotificationPayload): Promise<boolean> {
    if (!this.isSupported()) return false;
    if (Notification.permission !== 'granted') return false;

    try {
      const reg = await navigator.serviceWorker.ready;
      reg.active?.postMessage({ type: 'NOTIFY', payload });
      return true;
    } catch {
      try {
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon ?? '/favicon.svg',
          tag: payload.tag,
        });
        return true;
      } catch {
        return false;
      }
    }
  },
};
