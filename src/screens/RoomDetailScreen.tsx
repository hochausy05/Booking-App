import { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TIME_SLOTS } from '../constants/timeSlots';
import { EQUIPMENT_LABELS } from '../constants/equipment';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { TimeSlotButton } from '../components/TimeSlotButton';
import { rooms } from '../constants/rooms';
import type { RoomsStackParamList } from '../navigation/navigationTypes';
import { getRoomAvailability } from '../utils/roomAvailability';
import { formatDateForSummary, getNextSevenDates } from '../utils/roomDates';
import { getSlotAvailability } from '../utils/slotAvailability';

type Props = NativeStackScreenProps<RoomsStackParamList, 'RoomDetail'>;

export function RoomDetailScreen({ navigation, route }: Props) {
  const room = rooms.find((candidate) => candidate.id === route.params.roomId);
  const dates = useMemo(() => getNextSevenDates(), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].dateKey);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const selectDate = (dateKey: string) => {
    setSelectedDate(dateKey);
    setSelectedSlotId(null);
  };

  const goBackButton = (
    <Pressable
      accessibilityRole="button"
      onPress={() => navigation.goBack()}
      style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
    >
      <Text style={styles.backText}>Back to Study Rooms</Text>
    </Pressable>
  );

  if (!room) {
    return (
      <View style={styles.fallbackContainer}>
        <Text style={styles.title}>Room not found</Text>
        <Text style={styles.description}>This room is unavailable or the room ID is invalid.</Text>
        {goBackButton}
      </View>
    );
  }

  const availability = getRoomAvailability(room);
  const equipment = EQUIPMENT_LABELS.filter(({ key }) => room.equipment[key]).map(({ label }) => label);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      {room.image ? (
        <Image source={room.image} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.imageFallbackText}>Room photo unavailable</Text>
        </View>
      )}

      <View style={styles.headingRow}>
        <Text style={styles.title}>{room.name}</Text>
        <View style={[styles.statusBadge, availability === 'available' ? styles.availableBadge : styles.occupiedBadge]}>
          <Text style={[styles.statusText, availability === 'available' ? styles.availableText : styles.occupiedText]}>
            {availability === 'available' ? 'Available Now' : 'Occupied'}
          </Text>
        </View>
      </View>
      <Text style={styles.description}>Building {room.building} · Floor {room.floor} · Capacity {room.capacity}</Text>

      <Text style={styles.sectionTitle}>Equipment</Text>
      <Text style={styles.equipment}>{equipment.length ? equipment.join(' · ') : 'No equipment listed'}</Text>

      <Text style={styles.sectionTitle}>Choose a date</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
        {dates.map(({ dateKey, weekday, dayNumber, isToday }) => {
          const selected = selectedDate === dateKey;
          return (
            <Pressable
              key={dateKey}
              accessibilityRole="button"
              accessibilityLabel={`${isToday ? 'Today, ' : ''}${weekday} ${dayNumber}`}
              accessibilityState={{ selected }}
              onPress={() => selectDate(dateKey)}
              style={({ pressed }) => [styles.dateButton, selected && styles.dateSelected, pressed && styles.pressed]}
            >
              <Text style={[styles.weekday, selected && styles.selectedText]}>{isToday ? 'Today' : weekday}</Text>
              <Text style={[styles.dayNumber, selected && styles.selectedText]}>{dayNumber}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.sectionTitle}>Time slots</Text>
      <View style={styles.slotGrid}>
        {TIME_SLOTS.map((slot) => {
          const availabilityState = getSlotAvailability(room.id, selectedDate, slot);
          const state = selectedSlotId === slot.id && availabilityState === 'available'
            ? 'selected'
            : availabilityState;
          return (
            <TimeSlotButton
              key={slot.id}
              label={slot.label}
              state={state}
              onPress={() => setSelectedSlotId(slot.id)}
            />
          );
        })}
      </View>

      {selectedSlotId ? (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Selected</Text>
          <Text style={styles.summaryText}>{room.name}</Text>
          <Text style={styles.summaryText}>{formatDateForSummary(selectedDate)}</Text>
          <Text style={styles.summaryText}>{TIME_SLOTS.find((slot) => slot.id === selectedSlotId)?.label}</Text>
        </View>
      ) : null}

      {goBackButton}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: colors.background, flex: 1 },
  container: { padding: spacing.md, paddingBottom: spacing.xl },
  fallbackContainer: { backgroundColor: colors.background, flex: 1, padding: spacing.lg },
  image: { backgroundColor: colors.border, borderRadius: borderRadius.md, height: 180, width: '100%' },
  imageFallback: {
    alignItems: 'center',
    backgroundColor: '#E9EDF5',
    borderRadius: borderRadius.md,
    height: 180,
    justifyContent: 'center',
    width: '100%',
  },
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
  sectionTitle: { color: colors.text, fontSize: fontSize.screenTitle, fontWeight: '700', marginTop: spacing.lg, marginBottom: spacing.sm },
  equipment: { color: colors.text, fontSize: fontSize.body },
  dateRow: { paddingVertical: spacing.xs },
  dateButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    justifyContent: 'center',
    marginRight: spacing.sm,
    minHeight: 68,
    minWidth: 68,
    padding: spacing.sm,
  },
  dateSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  weekday: { color: colors.mutedText, fontSize: 12, fontWeight: '600' },
  dayNumber: { color: colors.text, fontSize: fontSize.body, fontWeight: '700', marginTop: spacing.xs },
  selectedText: { color: colors.surface },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  summary: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: borderRadius.md, borderWidth: 1, marginTop: spacing.md, padding: spacing.md },
  summaryTitle: { color: colors.text, fontSize: fontSize.caption, fontWeight: '700', marginBottom: spacing.xs },
  summaryText: { color: colors.mutedText, fontSize: fontSize.caption, marginTop: 2 },
  backButton: { alignSelf: 'flex-start', marginTop: spacing.lg, minHeight: 44, justifyContent: 'center', paddingVertical: spacing.sm },
  backText: { color: colors.primary, fontSize: fontSize.body, fontWeight: '600' },
  pressed: { opacity: 0.8 },
});
