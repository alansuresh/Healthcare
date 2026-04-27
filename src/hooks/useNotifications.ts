import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { notificationService } from '../services/notificationService';
import type { NotificationPayload } from '../types';

export function useNotifications() {
  const supported = notificationService.isSupported();
  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? notificationService.permission() : 'denied',
  );

  useEffect(() => {
    if (!supported) return;
    setPermission(notificationService.permission());
  }, [supported]);

  const request = useCallback(async () => {
    const result = await notificationService.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      toast.success('Notifications enabled');
    } else if (result === 'denied') {
      toast.error('Notifications blocked. Enable them in browser settings.');
    }
    return result;
  }, []);

  const notify = useCallback(
    async (payload: NotificationPayload) => {
      // Always surface in-app toast for visibility, even if OS perms denied.
      toast(payload.title, {
        icon: '🔔',
        duration: 5000,
      });
      if (permission !== 'granted') return false;
      return notificationService.show(payload);
    },
    [permission],
  );

  return { supported, permission, request, notify };
}
