import type { TimeSlot } from '../types';

export const TIME_SLOTS = [
  { id: '07:30-09:30', startTime: '07:30', endTime: '09:30', label: '07:30–09:30' },
  { id: '09:30-11:30', startTime: '09:30', endTime: '11:30', label: '09:30–11:30' },
  { id: '13:00-15:00', startTime: '13:00', endTime: '15:00', label: '13:00–15:00' },
  { id: '15:00-17:00', startTime: '15:00', endTime: '17:00', label: '15:00–17:00' },
] satisfies readonly TimeSlot[];
