import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { getRoomAvailability } from '../utils/roomAvailability';
import type { Room } from '../types';

type RoomCardProps = {
  room: Room;
  onPress: (roomId: string) => void;
};

const equipmentLabels = [
  { key: 'projector', label: 'Projector' },
  { key: 'whiteboard', label: 'Whiteboard' },
  { key: 'highSpecPc', label: 'High-spec PC' },
  { key: 'ac', label: 'AC' },
] as const;

function RoomCardComponent({ room, onPress }: RoomCardProps) {
  const availability = getRoomAvailability(room);
  const isAvailable = availability === 'available';
  const equipmentSummary = equipmentLabels
    .filter(({ key }) => room.equipment[key])
    .map(({ label }) => label)
    .join(' · ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${room.name}, Building ${room.building}, ${isAvailable ? 'Available Now' : 'Occupied'}`}
      onPress={() => onPress(room.id)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {room.image ? (
        <Image source={room.image} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.imageFallbackText}>Room photo unavailable</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.roomName}>{room.name}</Text>
          <View style={[styles.statusBadge, isAvailable ? styles.availableBadge : styles.occupiedBadge]}>
            <Text style={[styles.statusText, isAvailable ? styles.availableText : styles.occupiedText]}>
              {isAvailable ? 'Available Now' : 'Occupied'}
            </Text>
          </View>
        </View>
        <Text style={styles.meta}>Building {room.building} · Floor {room.floor} · Capacity {room.capacity}</Text>
        <Text style={styles.equipment} numberOfLines={2}>
          {equipmentSummary || 'No equipment listed'}
        </Text>
      </View>
    </Pressable>
  );
}

export const RoomCard = memo(RoomCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.85,
  },
  image: {
    backgroundColor: colors.border,
    height: 132,
    width: '100%',
  },
  imageFallback: {
    alignItems: 'center',
    backgroundColor: '#E9EDF5',
    height: 132,
    justifyContent: 'center',
    width: '100%',
  },
  imageFallbackText: {
    color: colors.mutedText,
    fontSize: fontSize.caption,
  },
  content: {
    padding: spacing.md,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  roomName: {
    color: colors.text,
    flexShrink: 1,
    fontSize: fontSize.screenTitle,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  statusBadge: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  availableBadge: {
    backgroundColor: '#E7F6EC',
  },
  occupiedBadge: {
    backgroundColor: '#FDECEC',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#237A3B',
  },
  occupiedText: {
    color: '#B42318',
  },
  meta: {
    color: colors.mutedText,
    fontSize: fontSize.caption,
    marginBottom: spacing.sm,
  },
  equipment: {
    color: colors.text,
    fontSize: fontSize.caption,
  },
});
