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
  userBookings: Booking[];
  notificationIds: Record<string, string>;
  hasHydrated: boolean;
  setSearch: (search: string) => void;
  setBuilding: (building: RoomFilters['building']) => void;
  setCapacity: (capacity: CapacityRange) => void;
  toggleEquipment: (equipment: EquipmentKey) => void;
  clearFilters: () => void;
  setUserBookings: (bookings: Booking[]) => void;
  upsertBooking: (booking: Booking) => void;
  setNotificationId: (bookingId: string, notificationId: string) => void;
  removeNotificationId: (bookingId: string) => void;
  cancelBooking: (
    bookingId: string,
    cancelRemotely: (bookingId: string) => Promise<Booking>,
  ) => Promise<Booking>;
  setHasHydrated: (hasHydrated: boolean) => void;
};

type PersistedBookingState = Pick<BookingStore, 'demoUser' | 'filters'>;

export const useBookingStore = create<BookingStore>()(
  persist<BookingStore, [], [], PersistedBookingState>(
    (set) => ({
      demoUser: DEMO_USER,
      filters: createInitialFilters(),
      // Runtime cache only. Supabase remains the source of truth for bookings.
      userBookings: [],
      notificationIds: {},
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
      setUserBookings: (bookings) => set({ userBookings: bookings }),
      upsertBooking: (booking) => set((state) => ({
        userBookings: [...state.userBookings.filter((item) => item.id !== booking.id), booking],
      })),
      setNotificationId: (bookingId, notificationId) => set((state) => ({
        notificationIds: { ...state.notificationIds, [bookingId]: notificationId },
      })),
      removeNotificationId: (bookingId) => set((state) => {
        const notificationIds = { ...state.notificationIds };
        delete notificationIds[bookingId];
        return { notificationIds };
      }),
      cancelBooking: async (bookingId, cancelRemotely) => {
        // Update the local runtime cache only after the caller's bookingService operation succeeds.
        const cancelledBooking = await cancelRemotely(bookingId);
        set((state) => ({
          userBookings: [...state.userBookings.filter((booking) => booking.id !== bookingId), cancelledBooking],
        }));
        return cancelledBooking;
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
