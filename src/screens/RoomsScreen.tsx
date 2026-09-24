import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { borderRadius, colors, fontSize, spacing } from '../constants/theme';
import type { RoomsStackParamList } from '../navigation/navigationTypes';

type Props = NativeStackScreenProps<RoomsStackParamList, 'RoomsHome'>;

export function RoomsScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Rooms</Text>
      <Text style={styles.description}>Room discovery will be available here.</Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('RoomDetail')}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonText}>Open temporary Room Detail preview</Text>
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
  button: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: colors.surface,
    fontSize: fontSize.caption,
    fontWeight: '600',
  },
});
