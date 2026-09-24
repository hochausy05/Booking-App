import type { RoomEquipment } from '../types';

export const EQUIPMENT_LABELS: Array<{ key: keyof RoomEquipment; label: string }> = [
  { key: 'projector', label: 'Máy chiếu' },
  { key: 'whiteboard', label: 'Bảng trắng' },
  { key: 'highSpecPc', label: 'Máy tính cấu hình cao' },
  { key: 'ac', label: 'Điều hòa' },
];
