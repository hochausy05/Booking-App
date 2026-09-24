import type { ImageSourcePropType } from 'react-native';

export type Building = 'A' | 'B' | 'C' | 'V';

export type RoomEquipment = {
  projector: boolean;
  whiteboard: boolean;
  highSpecPc: boolean;
  ac: boolean;
};

export type Room = {
  id: string;
  name: string;
  building: Building;
  floor: number;
  capacity: number;
  image: ImageSourcePropType | null;
  equipment: RoomEquipment;
};
