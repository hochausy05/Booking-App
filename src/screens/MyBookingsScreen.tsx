import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookingPassModal } from '../components/BookingPassModal';
import { rooms } from '../constants/rooms';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { cancelBooking as cancelRemoteBooking, getUserBookings } from '../services/bookingService';
import { cancelBookingReminder } from '../services/bookingNotifications';
import { useBookingStore } from '../store/useBookingStore';
import type { Booking } from '../types/booking';
import { formatDateForSummary } from '../utils/roomDates';

function getBookingStart(booking: Booking): number {
  const [year, month, day] = booking.date.split('-').map(Number);
  const [hour, minute] = booking.startTime.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute).getTime();
}

function sortBookings(bookings: Booking[]): Booking[] {
  const now = Date.now();
  const rank = (booking: Booking) => {
    if (booking.status === 'active' && getBookingStart(booking) >= now) return 0;
    if (booking.status === 'active') return 1;
    if (booking.status === 'cancelled') return 2;
    return 3;
  };
  return [...bookings].sort((first, second) => rank(first) - rank(second) || getBookingStart(first) - getBookingStart(second));
}

export function MyBookingsScreen() {
  const demoUserId = useBookingStore((state) => state.demoUser.id);
  const bookings = useBookingStore((state) => state.userBookings);
  const setUserBookings = useBookingStore((state) => state.setUserBookings);
  const cancelFromStore = useBookingStore((state) => state.cancelBooking);
  const notificationIds = useBookingStore((state) => state.notificationIds);
  const removeNotificationId = useBookingStore((state) => state.removeNotificationId);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [passBooking, setPassBooking] = useState<Booking | null>(null);

  const loadBookings = useCallback(async (pullToRefresh = false) => {
    if (pullToRefresh) setRefreshing(true);
    else setLoading(true);
    setErrorMessage(null);
    try {
      const remoteBookings = await getUserBookings(demoUserId);
      setUserBookings(remoteBookings);
    } catch {
      setErrorMessage('Không thể tải lịch đặt phòng. Vui lòng kiểm tra kết nối và thử lại.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [demoUserId, setUserBookings]);

  useFocusEffect(useCallback(() => {
    void loadBookings();
  }, [loadBookings]));

  const sortedBookings = useMemo(() => sortBookings(bookings), [bookings]);
  const selectedRoomName = passBooking
    ? rooms.find((room) => room.id === passBooking.roomId)?.name ?? passBooking.roomId
    : '';

  const requestCancellation = (booking: Booking) => {
    Alert.alert(
      'Hủy đặt phòng',
      'Bạn có chắc muốn hủy lịch đặt phòng này không?',
      [
        { text: 'Giữ lịch', style: 'cancel' },
        {
          text: 'Hủy đặt phòng',
          style: 'destructive',
          onPress: () => { void performCancellation(booking); },
        },
      ],
    );
  };

  const performCancellation = async (booking: Booking) => {
    if (cancellingId) return;
    setCancellingId(booking.id);
    setErrorMessage(null);
    setNoticeMessage(null);
    const notificationId = notificationIds[booking.id];
    try {
      await cancelFromStore(booking.id, (bookingId) => cancelRemoteBooking(bookingId, demoUserId));
      if (notificationId) {
        try {
          await cancelBookingReminder(notificationId);
        } catch {
          setNoticeMessage('Đã hủy lịch nhưng không thể xóa lời nhắc trên thiết bị.');
        }
      }
      removeNotificationId(booking.id);
      await loadBookings(true);
    } catch {
      setErrorMessage('Không thể hủy lịch đặt phòng. Vui lòng tải lại danh sách và thử lại.');
    } finally {
      setCancellingId(null);
    }
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const room = rooms.find((candidate) => candidate.id === item.roomId);
    const statusLabel = item.status === 'active'
      ? getBookingStart(item) >= Date.now() ? 'Sắp tới' : 'Đang hoạt động'
      : item.status === 'cancelled' ? 'Đã hủy' : 'Đã hoàn thành';
    return (
      <View style={styles.bookingCard}>
        <View style={styles.bookingHeading}>
          <Text style={styles.roomName}>{room?.name ?? item.roomId}</Text>
          <View style={[styles.statusBadge, item.status === 'active' ? styles.activeBadge : styles.inactiveBadge]}>
            <Text style={[styles.statusText, item.status === 'active' ? styles.activeText : styles.inactiveText]}>{statusLabel}</Text>
          </View>
        </View>
        <Text style={styles.metadata}>
          {room ? `Tòa ${room.building} · Tầng ${room.floor}` : 'Thông tin phòng không còn khả dụng'}
        </Text>
        <Text style={styles.metadata}>{formatDateForSummary(item.date)} · {item.startTime}–{item.endTime}</Text>
        {item.status === 'active' ? (
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              disabled={cancellingId === item.id}
              onPress={() => setPassBooking(item)}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryButtonText}>Xem mã QR</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={cancellingId !== null}
              onPress={() => requestCancellation(item)}
              style={({ pressed }) => [styles.cancelButton, (pressed || cancellingId === item.id) && styles.pressed]}
            >
              {cancellingId === item.id
                ? <ActivityIndicator color={colors.primary} />
                : <Text style={styles.cancelButtonText}>Hủy đặt phòng</Text>}
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={sortedBookings}
        keyExtractor={(booking) => booking.id}
        ListEmptyComponent={loading ? (
          <View style={styles.stateContainer}><ActivityIndicator color={colors.primary} /><Text style={styles.stateText}>Đang tải lịch đặt phòng…</Text></View>
        ) : errorMessage ? (
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>{errorMessage}</Text>
            <Pressable accessibilityRole="button" onPress={() => { void loadBookings(); }} style={styles.retryButton}>
              <Text style={styles.retryText}>Thử lại</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.stateContainer}><Text style={styles.stateText}>Bạn chưa có lịch đặt phòng.</Text></View>
        )}
        ListHeaderComponent={(
          <View>
            <Text style={styles.title}>Lịch đặt phòng</Text>
            {loading && bookings.length ? <Text style={styles.updatingMessage}>Đang cập nhật lịch đặt phòng…</Text> : null}
            {errorMessage && bookings.length ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
            {noticeMessage ? <Text style={styles.noticeMessage}>{noticeMessage}</Text> : null}
          </View>
        )}
        refreshControl={<RefreshControl onRefresh={() => { void loadBookings(true); }} refreshing={refreshing} tintColor={colors.primary} />}
        renderItem={renderBooking}
        showsVerticalScrollIndicator={false}
      />
      <BookingPassModal booking={passBooking} roomName={selectedRoomName} onClose={() => setPassBooking(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  listContent: { padding: spacing.md, paddingBottom: spacing.xl + 72, flexGrow: 1 },
  title: { color: colors.text, fontSize: fontSize.title, fontWeight: '700', marginBottom: spacing.md },
  bookingCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, borderWidth: 1, marginBottom: spacing.md, padding: spacing.md },
  bookingHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  roomName: { color: colors.text, flexShrink: 1, fontSize: fontSize.screenTitle, fontWeight: '700', marginRight: spacing.sm },
  statusBadge: { borderRadius: borderRadius.lg, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  activeBadge: { backgroundColor: '#E7F6EC' },
  inactiveBadge: { backgroundColor: '#EEF0F3' },
  statusText: { fontSize: fontSize.caption, fontWeight: '600' },
  activeText: { color: '#237A3B' },
  inactiveText: { color: colors.mutedText },
  metadata: { color: colors.mutedText, fontSize: fontSize.caption, marginTop: spacing.xs },
  actions: { flexDirection: 'row', flexWrap: 'wrap', marginTop: spacing.md },
  secondaryButton: { alignItems: 'center', borderColor: colors.primary, borderRadius: borderRadius.md, borderWidth: 1, justifyContent: 'center', marginRight: spacing.sm, minHeight: 44, paddingHorizontal: spacing.md },
  secondaryButtonText: { color: colors.primary, fontSize: fontSize.caption, fontWeight: '700' },
  cancelButton: { alignItems: 'center', justifyContent: 'center', minHeight: 44, paddingHorizontal: spacing.md },
  cancelButtonText: { color: '#B42318', fontSize: fontSize.caption, fontWeight: '700' },
  stateContainer: { alignItems: 'center', flexGrow: 1, justifyContent: 'center', paddingVertical: spacing.xl },
  stateText: { color: colors.mutedText, fontSize: fontSize.body, marginTop: spacing.sm, textAlign: 'center' },
  retryButton: { alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm, minHeight: 44, paddingHorizontal: spacing.md },
  retryText: { color: colors.primary, fontSize: fontSize.caption, fontWeight: '700' },
  errorMessage: { color: '#B42318', fontSize: fontSize.caption, marginBottom: spacing.sm },
  updatingMessage: { color: colors.mutedText, fontSize: fontSize.caption, marginBottom: spacing.sm },
  noticeMessage: { color: colors.mutedText, fontSize: fontSize.caption, marginBottom: spacing.sm },
  pressed: { opacity: 0.75 },
});
