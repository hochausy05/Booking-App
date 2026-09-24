import { Pressable, StyleSheet, Text } from 'react-native';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import type { SlotAvailability } from '../utils/slotAvailability';

type TimeSlotButtonProps = {
  label: string;
  state: SlotAvailability | 'selected';
  onPress: () => void;
};

export function TimeSlotButton({ label, state, onPress }: TimeSlotButtonProps) {
  const disabled = state === 'booked' || state === 'past';
  const stateLabel = state === 'booked' ? 'Đã đặt' : state === 'past' ? 'Đã qua' : state === 'selected' ? 'Đã chọn' : 'Còn trống';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${stateLabel}`}
      accessibilityState={{ disabled, selected: state === 'selected' }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        state === 'selected' && styles.selected,
        state === 'booked' && styles.booked,
        state === 'past' && styles.past,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, state === 'selected' && styles.emphasis, state === 'booked' && styles.bookedText]}>{label}</Text>
      <Text style={[styles.state, state === 'selected' && styles.emphasis, state === 'booked' && styles.bookedText]}>{stateLabel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    marginBottom: spacing.sm,
    minHeight: 64,
    padding: spacing.sm,
    width: '48%',
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  booked: { backgroundColor: '#FDECEC', borderColor: '#F3B7B3' },
  past: { backgroundColor: '#EEF0F3', borderColor: colors.border },
  bookedText: { color: '#B42318' },
  pressed: { opacity: 0.8 },
  label: { color: colors.text, fontSize: fontSize.body, fontWeight: '700' },
  state: { color: colors.mutedText, fontSize: 12, marginTop: spacing.xs },
  emphasis: { color: colors.surface },
});
