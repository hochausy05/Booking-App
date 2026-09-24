import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RoomCard } from '../components/RoomCard';
import { rooms } from '../constants/rooms';
import { colors, fontSize, spacing } from '../constants/theme';
import type { Room } from '../types';
import type { RoomsStackParamList } from '../navigation/navigationTypes';

type Props = NativeStackScreenProps<RoomsStackParamList, 'RoomsHome'>;

export function RoomsScreen({ navigation }: Props) {
  const openRoomDetail = useCallback(
    (roomId: string) => navigation.navigate('RoomDetail', { roomId }),
    [navigation],
  );

  const renderRoom: ListRenderItem<Room> = useCallback(
    ({ item }) => <RoomCard room={item} onPress={openRoomDetail} />,
    [openRoomDetail],
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={rooms}
        keyExtractor={(room) => room.id}
        ListEmptyComponent={
          <Text style={styles.emptyState}>No study rooms are available right now.</Text>
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Study Rooms</Text>
            <Text style={styles.subtitle}>Find a space that works for your study session.</Text>
          </View>
        }
        renderItem={renderRoom}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.title,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.mutedText,
    fontSize: fontSize.body,
  },
  emptyState: {
    color: colors.mutedText,
    fontSize: fontSize.body,
    paddingVertical: spacing.xl,
    textAlign: 'center',
  },
});
