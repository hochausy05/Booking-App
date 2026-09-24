import type { RoomEquipment } from '../types';

export const EQUIPMENT_LABELS: Array<{ key: keyof RoomEquipment; label: string }> = [
  { key: 'projector', label: 'Projector' },
  { key: 'whiteboard', label: 'Whiteboard' },
  { key: 'highSpecPc', label: 'High-spec PC' },
  { key: 'ac', label: 'AC' },
];
