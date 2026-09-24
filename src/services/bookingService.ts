import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Booking, BookingRow, CreateBookingInput } from '../types/booking';
import { supabase, supabaseConfigurationError } from './supabase';

const bookingColumns = 'id, room_id, user_id, booking_date, start_time, end_time, status, created_at';

export class BookingServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingServiceError';
  }
}

export class BookingConflictError extends BookingServiceError {
  constructor() {
    super('This time slot was just booked by another user. Please select another slot.');
    this.name = 'BookingConflictError';
  }
}

function requireSupabase() {
  if (!supabase) throw new BookingServiceError(supabaseConfigurationError ?? 'Booking service is unavailable.');
  return supabase;
}

function mapBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    roomId: row.room_id,
    userId: row.user_id,
    date: row.booking_date,
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getActiveBookingsForRoomDate(roomId: string, date: string): Promise<Booking[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('bookings')
    .select(bookingColumns)
    .eq('room_id', roomId)
    .eq('booking_date', date)
    .eq('status', 'active')
    .order('start_time');

  if (error) throw new BookingServiceError('Could not load room availability. Check your connection and try again.');
  return (data ?? []).map(mapBooking);
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  const client = requireSupabase();
  const currentBookings = await getActiveBookingsForRoomDate(input.roomId, input.date);
  if (currentBookings.some((booking) => booking.startTime === input.startTime && booking.endTime === input.endTime)) {
    throw new BookingConflictError();
  }

  const { data, error } = await client
    .from('bookings')
    .insert({
      room_id: input.roomId,
      user_id: input.userId,
      booking_date: input.date,
      start_time: input.startTime,
      end_time: input.endTime,
      status: 'active',
    })
    .select(bookingColumns)
    .single();

  if (error?.code === '23505') throw new BookingConflictError();
  if (error || !data) throw new BookingServiceError('Could not create the booking. Check your connection and try again.');
  return mapBooking(data);
}

export function subscribeToRoomDateBookings(
  roomId: string,
  date: string,
  onChange: () => void,
): () => void {
  if (!supabase) return () => undefined;
  const client = supabase;

  const channel: RealtimeChannel = client
    .channel(`bookings:${roomId}:${date}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bookings', filter: `room_id=eq.${roomId}` },
      (payload) => {
        const current = payload.new as Partial<BookingRow>;
        const previous = payload.old as Partial<BookingRow>;
        if (current.booking_date === date || previous.booking_date === date) onChange();
      },
    )
    .subscribe();

  return () => {
    void client.removeChannel(channel);
  };
}
