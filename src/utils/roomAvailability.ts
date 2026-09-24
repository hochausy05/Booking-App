import type { Room } from '../types';

export type RoomAvailability = 'available' | 'occupied';

/** Temporary deterministic UI status; replace with booking/time-derived availability in MP2-07. */
export function getRoomAvailability(room: Pick<Room, 'id'>): RoomAvailability {
  const checksum = Array.from(room.id).reduce((total, character) => total + character.charCodeAt(0), 0);
  return checksum % 2 === 0 ? 'available' : 'occupied';
}
