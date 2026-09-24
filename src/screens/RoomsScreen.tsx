import { useCallback, useMemo, useState } from 'react';
import { FlatList, Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ListRenderItem } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FilterChip } from '../components/FilterChip';
import { RoomCard } from '../components/RoomCard';
import { rooms } from '../constants/rooms';
import { colors, fontSize, spacing } from '../constants/theme';
import type { Room } from '../types';
import type { RoomsStackParamList } from '../navigation/navigationTypes';
import { filterRooms } from '../utils/filterRooms';
import type { CapacityRange, EquipmentKey, RoomFilters } from '../utils/filterRooms';

type Props = NativeStackScreenProps<RoomsStackParamList, 'RoomsHome'>;
const buildings: Array<Room['building'] | 'all'> = ['all', 'A', 'B', 'C', 'V'];
const capacityOptions: Array<{ key: CapacityRange; label: string }> = [
  { key: 'any', label: 'Any' },
  { key: '2-4', label: '2–4' },
  { key: '5-10', label: '5–10' },
  { key: '11-20', label: '11–20' },
];
const equipmentOptions: Array<{ key: EquipmentKey; label: string }> = [
  { key: 'projector', label: 'Projector' },
  { key: 'whiteboard', label: 'Whiteboard' },
  { key: 'highSpecPc', label: 'High-spec PC' },
  { key: 'ac', label: 'AC' },
];
const initialFilters: RoomFilters = { search: '', building: 'all', capacity: 'any', equipment: [] };

export function RoomsScreen({ navigation }: Props) {
  const [filters, setFilters] = useState<RoomFilters>(initialFilters);
  const filteredRooms = useMemo(() => filterRooms(rooms, filters), [filters]);

  const openRoomDetail = useCallback(
    (roomId: string) => navigation.navigate('RoomDetail', { roomId }),
    [navigation],
  );
  const renderRoom: ListRenderItem<Room> = useCallback(
    ({ item }) => <RoomCard room={item} onPress={openRoomDetail} />,
    [openRoomDetail],
  );
  const toggleEquipment = (key: EquipmentKey) => {
    setFilters((current) => ({
      ...current,
      equipment: current.equipment.includes(key)
        ? current.equipment.filter((item) => item !== key)
        : [...current.equipment, key],
    }));
  };

  const listHeader = (
    <View style={styles.header}>
      <Text style={styles.title}>Study Rooms</Text>
      <Text style={styles.subtitle}>Find a space that works for your study session.</Text>
      <TextInput
        accessibilityLabel="Search rooms by name"
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={(search) => setFilters((current) => ({ ...current, search }))}
        onSubmitEditing={Keyboard.dismiss}
        placeholder="Search by room name"
        placeholderTextColor={colors.mutedText}
        returnKeyType="search"
        style={styles.search}
        value={filters.search}
      />

      <Text style={styles.filterHeading}>Building</Text>
      <ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
        {buildings.map((building) => {
          const selected = filters.building === building;
          return (
            <FilterChip
              key={building}
              label={building === 'all' ? 'All' : building}
              selected={selected}
              accessibilityLabel={building === 'all' ? 'All buildings' : `Building ${building}`}
              onPress={() => setFilters((current) => ({ ...current, building }))}
            />
          );
        })}
      </ScrollView>

      <Text style={styles.filterHeading}>Capacity</Text>
      <View style={styles.chipRow}>
        {capacityOptions.map(({ key, label }) => (
          <FilterChip
            key={key}
            label={label}
            selected={filters.capacity === key}
            onPress={() => setFilters((current) => ({ ...current, capacity: key }))}
          />
        ))}
      </View>

      <Text style={styles.filterHeading}>Equipment</Text>
      <View style={styles.chipRow}>
        {equipmentOptions.map(({ key, label }) => (
          <FilterChip
            key={key}
            label={label}
            selected={filters.equipment.includes(key)}
            onPress={() => toggleEquipment(key)}
          />
        ))}
      </View>
      <Text style={styles.resultCount}>{filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredRooms}
        keyExtractor={(room) => room.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyState}>No rooms match your filters.</Text>
            <FilterChip label="Clear filters" selected={false} onPress={() => setFilters(initialFilters)} />
          </View>
        }
        ListHeaderComponent={listHeader}
        renderItem={renderRoom}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  listContent: { padding: spacing.md, paddingBottom: spacing.xl },
  header: { marginBottom: spacing.md, paddingTop: spacing.sm },
  title: { color: colors.text, fontSize: fontSize.title, fontWeight: '700', marginBottom: spacing.xs },
  subtitle: { color: colors.mutedText, fontSize: fontSize.body, marginBottom: spacing.md },
  search: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: fontSize.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  filterHeading: { color: colors.text, fontSize: fontSize.caption, fontWeight: '700', marginBottom: spacing.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  resultCount: { color: colors.mutedText, fontSize: fontSize.caption, marginTop: spacing.xs },
  emptyContainer: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyState: { color: colors.mutedText, fontSize: fontSize.body, marginBottom: spacing.md, textAlign: 'center' },
});
