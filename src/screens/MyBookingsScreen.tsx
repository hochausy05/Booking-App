import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../constants/theme';

export function MyBookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <Text style={styles.description}>Your bookings will appear here.</Text>
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
});
