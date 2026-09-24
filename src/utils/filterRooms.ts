import type { Room, RoomEquipment } from '../types';

export type CapacityRange = 'any' | '2-4' | '5-10' | '11-20';
export type EquipmentKey = keyof RoomEquipment;

export type RoomFilters = {
  search: string;
  building: Room['building'] | 'all';
  capacity: CapacityRange;
  equipment: EquipmentKey[];
};

const capacityBounds: Record<Exclude<CapacityRange, 'any'>, [number, number]> = {
  '2-4': [2, 4],
  '5-10': [5, 10],
  '11-20': [11, 20],
};

export function filterRooms(rooms: Room[], filters: RoomFilters): Room[] {
  const query = filters.search.trim().toLocaleLowerCase();
  const bounds = filters.capacity === 'any' ? undefined : capacityBounds[filters.capacity];

  return rooms.filter((room) => {
    if (query && !room.name.toLocaleLowerCase().includes(query)) return false;
    if (filters.building !== 'all' && room.building !== filters.building) return false;
    if (bounds && (room.capacity < bounds[0] || room.capacity > bounds[1])) return false;
    return filters.equipment.every((key) => room.equipment[key]);
  });
}
