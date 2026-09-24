import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fontSize, spacing } from '../constants/theme';
import { rooms } from '../constants/rooms';
import type { RoomsStackParamList } from '../navigation/navigationTypes';

type Props = NativeStackScreenProps<RoomsStackParamList, 'RoomDetail'>;

export function RoomDetailScreen({ navigation, route }: Props) {
  const room = rooms.find((candidate) => candidate.id === route.params.roomId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{room?.name ?? 'Room not found'}</Text>
      <Text style={styles.description}>
        {room
          ? `Building ${room.building} · Floor ${room.floor} · Capacity ${room.capacity}`
          : 'This room is unavailable or the room ID is invalid.'}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backText}>Back to Study Rooms</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  description: {
    color: colors.mutedText,
    fontSize: fontSize.body,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  backText: {
    color: colors.primary,
    fontSize: fontSize.body,
    fontWeight: '600',
  },
});
