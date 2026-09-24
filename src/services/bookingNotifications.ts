import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Booking } from '../types/booking';

const bookingChannelId = 'booking-reminders';
const reminderLeadTimeMs = 15 * 60 * 1000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function getBookingReminderDate(booking: Pick<Booking, 'date' | 'startTime'>): Date {
  const [year, month, day] = booking.date.split('-').map(Number);
  const [hour, minute] = booking.startTime.split(':').map(Number);
  return new Date(new Date(year, month - 1, day, hour, minute).getTime() - reminderLeadTimeMs);
}

export type BookingReminderResult =
  | { status: 'scheduled'; notificationId: string }
  | { status: 'permission-denied' | 'not-needed' | 'failed' };

export async function scheduleBookingReminder(
  booking: Booking,
  roomName: string,
): Promise<BookingReminderResult> {
  const reminderDate = getBookingReminderDate(booking);
  if (reminderDate.getTime() <= Date.now()) return { status: 'not-needed' };

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(bookingChannelId, {
        name: 'Nhắc lịch đặt phòng',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const currentPermissions = await Notifications.getPermissionsAsync();
    const permissions = currentPermissions.granted
      ? currentPermissions
      : await Notifications.requestPermissionsAsync();
    if (!permissions.granted && permissions.status !== 'granted') {
      return { status: 'permission-denied' };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Nhắc lịch đặt phòng',
        body: `Lịch đặt phòng ${roomName} của bạn sẽ bắt đầu sau 15 phút.`,
        data: { bookingId: booking.id },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
        ...(Platform.OS === 'android' ? { channelId: bookingChannelId } : {}),
      },
    });
    return { status: 'scheduled', notificationId };
  } catch {
    // A reminder is optional; failures must not undo a booking already accepted by Supabase.
    return { status: 'failed' };
  }
}

export async function cancelBookingReminder(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
