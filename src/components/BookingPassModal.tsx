import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import type { Booking } from '../types/booking';
import { formatDateForSummary } from '../utils/roomDates';

type BookingPassModalProps = {
  booking: Booking | null;
  roomName: string;
  onClose: () => void;
};

export function getBookingPassPayload(booking: Booking): string {
  return JSON.stringify({
    bookingId: booking.id,
    roomId: booking.roomId,
    date: booking.date,
    startTime: booking.startTime,
    endTime: booking.endTime,
  });
}

export function BookingPassModal({ booking, roomName, onClose }: BookingPassModalProps) {
  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={booking !== null}
    >
      <View style={styles.overlay}>
        {booking ? (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>MÃ ĐẶT PHÒNG</Text>
            <Text style={styles.title}>{roomName}</Text>
            <Text style={styles.details}>{formatDateForSummary(booking.date)} · {booking.startTime}–{booking.endTime}</Text>
            <View style={styles.qrFrame}>
              <QRCode value={getBookingPassPayload(booking)} size={216} />
            </View>
            <Text style={styles.bookingIdLabel}>Mã đặt chỗ</Text>
            <Text selectable style={styles.bookingId}>{booking.id}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
            >
              <Text style={styles.closeButtonText}>Đóng</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { alignItems: 'center', backgroundColor: 'rgba(16, 24, 40, 0.55)', flex: 1, justifyContent: 'center', padding: spacing.md },
  card: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: borderRadius.lg, maxWidth: 400, padding: spacing.lg, width: '100%' },
  eyebrow: { color: colors.primary, fontSize: fontSize.caption, fontWeight: '700', letterSpacing: 1 },
  title: { color: colors.text, fontSize: fontSize.title, fontWeight: '700', marginTop: spacing.sm },
  details: { color: colors.mutedText, fontSize: fontSize.body, marginTop: spacing.xs, textAlign: 'center' },
  qrFrame: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, borderWidth: 1, marginTop: spacing.lg, padding: spacing.md },
  bookingIdLabel: { color: colors.mutedText, fontSize: fontSize.caption, fontWeight: '600', marginTop: spacing.md },
  bookingId: { color: colors.text, fontSize: 12, marginTop: spacing.xs, textAlign: 'center' },
  closeButton: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: borderRadius.md, justifyContent: 'center', marginTop: spacing.lg, minHeight: 48, width: '100%' },
  closeButtonText: { color: colors.surface, fontSize: fontSize.body, fontWeight: '700' },
  pressed: { opacity: 0.8 },
});
