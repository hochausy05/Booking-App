import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontSize, spacing } from '../constants/theme';

export function MyBookingsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <Text style={styles.title}>Lịch đặt phòng</Text>
      <Text style={styles.description}>Danh sách đặt phòng sẽ hiển thị tại đây.</Text>
    </SafeAreaView>
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
