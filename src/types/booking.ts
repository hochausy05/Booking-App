export type BookingStatus = 'active' | 'cancelled' | 'completed';

export type Booking = {
  id: string;
  roomId: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
};

export type CreateBookingInput = Pick<Booking, 'roomId' | 'userId' | 'date' | 'startTime' | 'endTime'>;

export type BookingRow = {
  id: string;
  room_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: BookingRow;
        Insert: {
          id?: string;
          room_id: string;
          user_id: string;
          booking_date: string;
          start_time: string;
          end_time: string;
          status?: BookingStatus;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
