import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, fontSize, spacing } from '../constants/theme';
import type { RoomsStackParamList } from '../navigation/navigationTypes';

type Props = NativeStackScreenProps<RoomsStackParamList, 'RoomDetail'>;

export function RoomDetailScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Detail</Text>
      <Text style={styles.description}>Temporary navigation preview.</Text>
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
