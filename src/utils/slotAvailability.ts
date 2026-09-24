import type { TimeSlot } from '../types';
import { toDateKey } from './roomDates';

export type SlotAvailability = 'available' | 'booked' | 'past';

/** Temporary deterministic development data; replace with booking availability in MP2-07. */
export function isTemporarilyBooked(roomId: string, dateKey: string, slotId: string): boolean {
  const input = `${roomId}|${dateKey}|${slotId}`;
  const hash = Array.from(input).reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 7);
  return hash % 4 === 0;
}

export function isSlotInPast(dateKey: string, endTime: string, now: Date = new Date()): boolean {
  if (dateKey !== toDateKey(now)) return false;

  const [hours, minutes] = endTime.split(':').map(Number);
  const slotEndMinutes = hours * 60 + minutes;
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  return slotEndMinutes <= currentMinutes;
}

export function getSlotAvailability(
  roomId: string,
  dateKey: string,
  slot: TimeSlot,
  now: Date = new Date(),
): SlotAvailability {
  if (isTemporarilyBooked(roomId, dateKey, slot.id)) return 'booked';
  if (isSlotInPast(dateKey, slot.endTime, now)) return 'past';
  return 'available';
}
