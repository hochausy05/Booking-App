import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TIME_SLOTS } from '../constants/timeSlots';
import { EQUIPMENT_LABELS } from '../constants/equipment';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { TimeSlotButton } from '../components/TimeSlotButton';
import { rooms } from '../constants/rooms';
import type { RoomsStackParamList } from '../navigation/navigationTypes';
import type { Booking } from '../types/booking';
import { BookingConflictError, createBooking, getActiveBookingsForRoomDate, subscribeToRoomDateBookings } from '../services/bookingService';
import { getRoomAvailability } from '../utils/roomAvailability';
import { formatDateForSummary, getNextSevenDates } from '../utils/roomDates';
import { isSlotInPast } from '../utils/slotAvailability';
import { useBookingStore } from '../store/useBookingStore';
import { scheduleBookingReminder } from '../services/bookingNotifications';

type Props = NativeStackScreenProps<RoomsStackParamList, 'RoomDetail'>;

export function RoomDetailScreen({ navigation, route }: Props) {
  const demoUserId = useBookingStore((state) => state.demoUser.id);
  const upsertBooking = useBookingStore((state) => state.upsertBooking);
  const setNotificationId = useBookingStore((state) => state.setNotificationId);
  const room = rooms.find((candidate) => candidate.id === route.params.roomId);
  const roomId = room?.id;
  const dates = useMemo(() => getNextSevenDates(), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].dateKey);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [reminderMessage, setReminderMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const availabilityRequestRef = useRef(0);

  const refreshAvailability = useCallback(async () => {
    if (!roomId) return;
    const requestId = ++availabilityRequestRef.current;
    setAvailabilityLoading(true);
    setAvailabilityError(null);
    try {
      const nextBookings = await getActiveBookingsForRoomDate(roomId, selectedDate);
      if (requestId === availabilityRequestRef.current) setBookings(nextBookings);
    } catch {
      if (requestId === availabilityRequestRef.current) {
        setAvailabilityError('Không thể tải dữ liệu đặt phòng. Vui lòng thử lại.');
      }
    } finally {
      if (requestId === availabilityRequestRef.current) setAvailabilityLoading(false);
    }
  }, [roomId, selectedDate]);

  useEffect(() => {
    if (!roomId) return undefined;
    void refreshAvailability();
    const unsubscribe = subscribeToRoomDateBookings(roomId, selectedDate, () => { void refreshAvailability(); });
    return () => {
      availabilityRequestRef.current += 1;
      unsubscribe();
    };
  }, [refreshAvailability, roomId, selectedDate]);

  useEffect(() => {
    setSelectedSlotId(null);
    setSuccessBooking(null);
  }, [roomId]);

  const goBackButton = (
    <Pressable
      accessibilityRole="button"
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
    >
      <Text style={styles.backText}>Quay lại danh sách phòng</Text>
    </Pressable>
  );

  const selectDate = (dateKey: string) => {
    availabilityRequestRef.current += 1;
    setSelectedDate(dateKey);
    setSelectedSlotId(null);
    setBookings([]);
    setBookingError(null);
    setReminderMessage(null);
    setSuccessBooking(null);
  };

  const submitBooking = async () => {
    const slot = TIME_SLOTS.find((candidate) => candidate.id === selectedSlotId);
    const slotAlreadyBooked = slot && bookings.some((booking) => booking.startTime === slot.startTime && booking.endTime === slot.endTime);
    if (!room || !slot || availabilityLoading || availabilityError || slotAlreadyBooked || isSlotInPast(selectedDate, slot.endTime) || submittingRef.current) return;

    submittingRef.current = true;
    setSubmitting(true);
    setBookingError(null);
    setReminderMessage(null);
    setSuccessBooking(null);
    try {
      const booking = await createBooking({
        roomId: room.id,
        userId: demoUserId,
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
      upsertBooking(booking);
      const reminder = await scheduleBookingReminder(booking, room.name);
      if (reminder.status === 'scheduled') {
        setNotificationId(booking.id, reminder.notificationId);
      } else if (reminder.status === 'permission-denied') {
        setReminderMessage('Chưa cấp quyền thông báo. Bạn vẫn có thể sử dụng chức năng đặt phòng.');
      } else if (reminder.status === 'failed') {
        setReminderMessage('Đã đặt phòng nhưng không thể bật nhắc lịch trên thiết bị.');
      }
      setBookings((current) => [...current, booking]);
      setSuccessBooking(booking);
      setSelectedSlotId(null);
      void refreshAvailability();
    } catch (error) {
      setSelectedSlotId(null);
      setBookingError(error instanceof BookingConflictError
        ? 'Khung giờ này vừa được người khác đặt. Vui lòng chọn khung giờ khác.'
        : 'Không thể đặt phòng. Vui lòng kiểm tra kết nối rồi thử lại.');
      if (error instanceof BookingConflictError) void refreshAvailability();
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };

  if (!room) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.title}>Không tìm thấy phòng</Text>
        <Text style={styles.description}>Phòng này không khả dụng hoặc mã phòng không hợp lệ.</Text>
        {goBackButton}
      </View>
    );
  }

  const availability = getRoomAvailability(room);
  const equipment = EQUIPMENT_LABELS.filter(({ key }) => room.equipment[key]).map(({ label }) => label);
  const selectedSlot = TIME_SLOTS.find((slot) => slot.id === selectedSlotId);
  const selectedSlotUnavailable = Boolean(selectedSlot && (
    bookings.some((booking) => booking.startTime === selectedSlot.startTime && booking.endTime === selectedSlot.endTime)
    || isSlotInPast(selectedDate, selectedSlot.endTime)
  ));
  const canBook = Boolean(selectedSlot && !selectedSlotUnavailable && !availabilityLoading && !availabilityError && !submitting);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {room.image ? <Image source={room.image} style={styles.image} /> : (
        <View style={styles.imageFallback}><Text style={styles.imageFallbackText}>Chưa có ảnh phòng</Text></View>
      )}

      <View style={styles.headingRow}>
        <Text style={styles.title}>{room.name}</Text>
        <View style={[styles.statusBadge, availability === 'available' ? styles.availableBadge : styles.occupiedBadge]}>
          <Text style={[styles.statusText, availability === 'available' ? styles.availableText : styles.occupiedText]}>
            {availability === 'available' ? 'Đang trống' : 'Đang sử dụng'}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>Tòa {room.building} · Tầng {room.floor}</Text>
      <Text style={styles.description}>Sức chứa: {room.capacity} người</Text>

      <Text style={styles.sectionTitle}>Thiết bị</Text>
      <Text style={styles.equipment}>{equipment.length ? equipment.join(' · ') : 'Chưa có thông tin thiết bị'}</Text>

      <Text style={styles.sectionTitle}>Chọn ngày</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
        {dates.map(({ dateKey, weekday, dayNumber, isToday }) => {
          const selected = selectedDate === dateKey;
          return (
            <Pressable
              key={dateKey}
              accessibilityRole="button"
              accessibilityLabel={`${isToday ? 'Hôm nay, ' : ''}${weekday}, ngày ${dayNumber}`}
              accessibilityState={{ selected }}
              onPress={() => selectDate(dateKey)}
              style={({ pressed }) => [styles.dateButton, isToday && styles.todayDateButton, selected && styles.dateSelected, pressed && styles.pressed]}
            >
              <Text style={[styles.weekday, selected && styles.selectedText]}>{isToday ? 'Hôm nay' : weekday}</Text>
              <Text style={[styles.dayNumber, selected && styles.selectedText]}>{dayNumber}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>Khung giờ</Text>
      {availabilityLoading ? (
        <View style={styles.messageRow}><ActivityIndicator color={colors.primary} /><Text style={styles.messageText}>Đang tải khung giờ…</Text></View>
      ) : availabilityError ? (
        <View style={styles.notice}>
          <Text style={styles.errorText}>{availabilityError}</Text>
          <Pressable accessibilityRole="button" onPress={() => { void refreshAvailability(); }} style={styles.retryButton}>
            <Text style={styles.retryText}>Thử lại</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.slotGrid}>
          {TIME_SLOTS.map((slot) => {
            const booked = bookings.some((booking) => booking.startTime === slot.startTime && booking.endTime === slot.endTime);
            const past = !booked && isSlotInPast(selectedDate, slot.endTime);
            const state = booked ? 'booked' : past ? 'past' : selectedSlotId === slot.id ? 'selected' : 'available';
            return (
              <TimeSlotButton
                key={slot.id}
                label={slot.label}
                state={state}
                onPress={() => { setSelectedSlotId(slot.id); setBookingError(null); setSuccessBooking(null); }}
              />
            );
          })}
        </View>
      )}

      {bookingError ? <Text accessibilityRole="alert" style={styles.errorText}>{bookingError}</Text> : null}
      {successBooking ? (
        <View style={styles.successNotice}>
          <Text style={styles.successTitle}>Đặt phòng thành công</Text>
          <Text style={styles.successText}>{room.name} · {formatDateForSummary(successBooking.date)}</Text>
          <Text style={styles.successText}>{successBooking.startTime}–{successBooking.endTime}</Text>
          {reminderMessage ? <Text style={styles.reminderText}>{reminderMessage}</Text> : null}
        </View>
      ) : null}

      {availabilityError ? null : (
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: !canBook, busy: submitting }}
          disabled={!canBook}
          onPress={() => { void submitBooking(); }}
          style={({ pressed }) => [styles.bookButton, !canBook && styles.bookButtonDisabled, pressed && styles.pressed]}
        >
          {submitting ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.bookButtonText}>Đặt phòng</Text>}
        </Pressable>
      )}

      {goBackButton}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: colors.background, flex: 1 },
  container: { padding: spacing.md, paddingBottom: spacing.xl + 72 },
  fallbackContainer: { backgroundColor: colors.background, flex: 1, padding: spacing.lg },
  image: { backgroundColor: colors.border, borderRadius: borderRadius.md, height: 180, width: '100%' },
  imageFallback: { alignItems: 'center', backgroundColor: '#E9EDF5', borderRadius: borderRadius.md, height: 180, justifyContent: 'center', width: '100%' },
  imageFallbackText: { color: colors.mutedText, fontSize: fontSize.caption },
  headingRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.md },
  title: { color: colors.text, flexShrink: 1, fontSize: fontSize.title, fontWeight: '700', marginRight: spacing.sm },
  description: { color: colors.mutedText, fontSize: fontSize.body, marginTop: spacing.xs },
  statusBadge: { borderRadius: borderRadius.lg, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  availableBadge: { backgroundColor: '#E7F6EC' },
  occupiedBadge: { backgroundColor: '#FDECEC' },
  statusText: { fontSize: 12, fontWeight: '600' },
  availableText: { color: '#237A3B' },
  occupiedText: { color: '#B42318' },
  sectionTitle: { color: colors.text, fontSize: fontSize.screenTitle, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.sm },
  equipment: { color: colors.text, fontSize: fontSize.body },
  dateRow: { paddingVertical: spacing.xs },
  dateButton: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, borderWidth: 1, justifyContent: 'center', marginRight: spacing.xs, minHeight: 64, minWidth: 52, paddingHorizontal: spacing.xs, paddingVertical: spacing.sm },
  todayDateButton: { minWidth: 68 },
  dateSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  weekday: { color: colors.mutedText, fontSize: 12, fontWeight: '600' },
  dayNumber: { color: colors.text, fontSize: fontSize.body, fontWeight: '700', marginTop: spacing.xs },
  selectedText: { color: colors.surface },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  messageRow: { alignItems: 'center', flexDirection: 'row', minHeight: 64 },
  messageText: { color: colors.mutedText, fontSize: fontSize.caption, marginLeft: spacing.sm },
  notice: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.md },
  errorText: { color: '#B42318', fontSize: fontSize.caption, marginTop: spacing.sm },
  retryButton: { alignSelf: 'flex-start', marginTop: spacing.sm, minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.md },
  retryText: { color: colors.primary, fontSize: fontSize.caption, fontWeight: '700' },
  bookButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: borderRadius.md, justifyContent: 'center', marginTop: spacing.md, minHeight: 48 },
  bookButtonDisabled: { backgroundColor: colors.mutedText },
  bookButtonText: { color: colors.surface, fontSize: fontSize.body, fontWeight: '700' },
  successNotice: { backgroundColor: '#E7F6EC', borderRadius: borderRadius.md, marginTop: spacing.md, padding: spacing.md },
  successTitle: { color: '#237A3B', fontSize: fontSize.body, fontWeight: '700', marginBottom: spacing.xs },
  successText: { color: colors.text, fontSize: fontSize.caption, marginTop: 2 },
  reminderText: { color: colors.mutedText, fontSize: fontSize.caption, marginTop: spacing.sm },
  backButton: { alignSelf: 'flex-start', marginTop: spacing.lg, minHeight: 44, justifyContent: 'center', paddingVertical: spacing.sm },
  backText: { color: colors.primary, fontSize: fontSize.body, fontWeight: '600' },
  pressed: { opacity: 0.8 },
});
