import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEMO_USER } from '../constants/demoUser';
import type { Booking } from '../types/booking';
import type { CapacityRange, EquipmentKey, RoomFilters } from '../utils/filterRooms';

const storageKey = 'study-room-booking-store';

export type DemoUser = {
  id: string;
  name: string;
};

const createInitialFilters = (): RoomFilters => ({
  search: '',
  building: 'all',
  capacity: 'any',
  equipment: [],
});

type BookingStore = {
  demoUser: DemoUser;
  filters: RoomFilters;
  activeBookings: Booking[];
  hasHydrated: boolean;
  setSearch: (search: string) => void;
  setBuilding: (building: RoomFilters['building']) => void;
  setCapacity: (capacity: CapacityRange) => void;
  toggleEquipment: (equipment: EquipmentKey) => void;
  clearFilters: () => void;
  setActiveBookings: (bookings: Booking[]) => void;
  upsertBooking: (booking: Booking) => void;
  removeCancelledBooking: (bookingId: string) => void;
  cancelBooking: (
    bookingId: string,
    cancelRemotely: (bookingId: string) => Promise<void>,
  ) => Promise<void>;
  setHasHydrated: (hasHydrated: boolean) => void;
};

type PersistedBookingState = Pick<BookingStore, 'demoUser' | 'filters'>;

export const useBookingStore = create<BookingStore>()(
  persist<BookingStore, [], [], PersistedBookingState>(
    (set) => ({
      demoUser: DEMO_USER,
      filters: createInitialFilters(),
      // Runtime cache only. Supabase remains the source of truth for bookings.
      activeBookings: [],
      hasHydrated: false,
      setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
      setBuilding: (building) => set((state) => ({ filters: { ...state.filters, building } })),
      setCapacity: (capacity) => set((state) => ({ filters: { ...state.filters, capacity } })),
      toggleEquipment: (equipment) => set((state) => ({
        filters: {
          ...state.filters,
          equipment: state.filters.equipment.includes(equipment)
            ? state.filters.equipment.filter((item) => item !== equipment)
            : [...state.filters.equipment, equipment],
        },
      })),
      clearFilters: () => set({ filters: createInitialFilters() }),
      setActiveBookings: (bookings) => set({ activeBookings: bookings.filter((booking) => booking.status === 'active') }),
      upsertBooking: (booking) => set((state) => ({
        activeBookings: booking.status === 'active'
          ? [...state.activeBookings.filter((item) => item.id !== booking.id), booking]
          : state.activeBookings.filter((item) => item.id !== booking.id),
      })),
      removeCancelledBooking: (bookingId) => set((state) => ({
        activeBookings: state.activeBookings.filter((booking) => booking.id !== bookingId),
      })),
      cancelBooking: async (bookingId, cancelRemotely) => {
        // Update the local runtime cache only after the caller's bookingService operation succeeds.
        await cancelRemotely(bookingId);
        set((state) => ({ activeBookings: state.activeBookings.filter((booking) => booking.id !== bookingId) }));
      },
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: storageKey,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ demoUser: state.demoUser, filters: state.filters }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
