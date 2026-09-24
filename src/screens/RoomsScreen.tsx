import { useCallback, useMemo, useState } from 'react';
import { FlatList, Keyboard, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  { key: 'any', label: 'Bất kỳ' },
  { key: '2-4', label: '2–4' },
  { key: '5-10', label: '5–10' },
  { key: '11-20', label: '11–20' },
];
const equipmentOptions: Array<{ key: EquipmentKey; label: string }> = [
  { key: 'projector', label: 'Máy chiếu' },
  { key: 'whiteboard', label: 'Bảng trắng' },
  { key: 'highSpecPc', label: 'Máy tính cấu hình cao' },
  { key: 'ac', label: 'Điều hòa' },
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
      <Text style={styles.title}>Phòng học</Text>
      <Text style={styles.subtitle}>Tìm không gian phù hợp cho buổi học của bạn.</Text>
      <TextInput
        accessibilityLabel="Tìm kiếm theo tên phòng"
        autoCorrect={false}
        clearButtonMode="while-editing"
        onChangeText={(search) => setFilters((current) => ({ ...current, search }))}
        onSubmitEditing={Keyboard.dismiss}
        placeholder="Tìm kiếm theo tên phòng"
        placeholderTextColor={colors.mutedText}
        returnKeyType="search"
        style={styles.search}
        value={filters.search}
      />

      <Text style={styles.filterHeading}>Tòa nhà</Text>
      <ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false}>
        {buildings.map((building) => {
          const selected = filters.building === building;
          return (
            <FilterChip
              key={building}
              label={building === 'all' ? 'Tất cả' : building}
              selected={selected}
              accessibilityLabel={building === 'all' ? 'Tất cả tòa nhà' : `Tòa nhà ${building}`}
              onPress={() => setFilters((current) => ({ ...current, building }))}
            />
          );
        })}
      </ScrollView>

      <Text style={styles.filterHeading}>Sức chứa</Text>
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

      <Text style={styles.filterHeading}>Thiết bị</Text>
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
      <Text style={styles.resultCount}>{filteredRooms.length} phòng</Text>
    </View>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={filteredRooms}
        keyExtractor={(room) => room.id}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyState}>Không tìm thấy phòng phù hợp.</Text>
            <FilterChip label="Xóa bộ lọc" selected={false} onPress={() => setFilters(initialFilters)} />
          </View>
        }
        ListHeaderComponent={listHeader}
        renderItem={renderRoom}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  listContent: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.xl + 72 },
  header: { marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: fontSize.title, fontWeight: '700', marginBottom: spacing.xs },
  subtitle: { color: colors.mutedText, fontSize: fontSize.caption, marginBottom: spacing.sm },
  search: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    fontSize: fontSize.body,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  filterHeading: { color: colors.text, fontSize: fontSize.caption, fontWeight: '700', marginTop: spacing.xs, marginBottom: spacing.xs },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.xs },
  resultCount: { color: colors.mutedText, fontSize: fontSize.caption, marginTop: spacing.xs },
  emptyContainer: { alignItems: 'center', paddingVertical: spacing.lg },
  emptyState: { color: colors.mutedText, fontSize: fontSize.body, marginBottom: spacing.md, textAlign: 'center' },
});
