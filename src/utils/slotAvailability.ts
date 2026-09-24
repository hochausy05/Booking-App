import { toDateKey } from './roomDates';

export type SlotAvailability = 'available' | 'booked' | 'past';

export function isSlotInPast(dateKey: string, endTime: string, now: Date = new Date()): boolean {
  if (dateKey !== toDateKey(now)) return false;

  const [hours, minutes] = endTime.split(':').map(Number);
  const slotEndMinutes = hours * 60 + minutes;
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  return slotEndMinutes <= currentMinutes;
}
