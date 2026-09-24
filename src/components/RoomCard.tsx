import { memo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import { EQUIPMENT_LABELS } from '../constants/equipment';
import { getRoomAvailability } from '../utils/roomAvailability';
import type { Room } from '../types';

type RoomCardProps = {
  room: Room;
  onPress: (roomId: string) => void;
};

function RoomCardComponent({ room, onPress }: RoomCardProps) {
  const availability = getRoomAvailability(room);
  const isAvailable = availability === 'available';
  const equipmentSummary = EQUIPMENT_LABELS
    .filter(({ key }) => room.equipment[key])
    .map(({ label }) => label)
    .join(' · ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${room.name}, tòa nhà ${room.building}, ${isAvailable ? 'Đang trống' : 'Đang sử dụng'}`}
      onPress={() => onPress(room.id)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {room.image ? (
        <Image source={room.image} style={styles.image} />
      ) : (
        <View style={styles.imageFallback}>
          <Text style={styles.imageFallbackText}>Chưa có ảnh phòng</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.roomName}>{room.name}</Text>
          <View style={[styles.statusBadge, isAvailable ? styles.availableBadge : styles.occupiedBadge]}>
            <Text style={[styles.statusText, isAvailable ? styles.availableText : styles.occupiedText]}>
              {isAvailable ? 'Đang trống' : 'Đang sử dụng'}
            </Text>
          </View>
        </View>
        <Text style={styles.meta}>Tòa {room.building} · Tầng {room.floor} · {room.capacity} người</Text>
        <Text style={styles.equipment} numberOfLines={2}>
          {equipmentSummary || 'Chưa có thông tin thiết bị'}
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
    height: 92,
    width: '100%',
  },
  imageFallback: {
    alignItems: 'center',
    backgroundColor: '#E9EDF5',
    height: 92,
    justifyContent: 'center',
    width: '100%',
  },
  imageFallbackText: {
    color: colors.mutedText,
    fontSize: fontSize.caption,
  },
  content: {
    padding: spacing.sm + 4,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  roomName: {
    color: colors.text,
    flexShrink: 1,
    fontSize: fontSize.body,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  statusBadge: {
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 3,
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
