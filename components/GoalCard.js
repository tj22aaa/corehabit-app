import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../styles/theme';

export default function GoalCard({ goal, onPress, onToggle }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Pressable
          style={({ pressed }) => [styles.textBlock, pressed && styles.pressed]}
          onPress={onPress}
        >
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.detail}>{goal.target}</Text>
        </Pressable>
        <Pressable
          style={[styles.check, goal.completed && styles.checkDone]}
          onPress={onToggle}
        >
          <Text style={[styles.checkText, goal.completed && styles.checkTextDone]}>
            {goal.completed ? 'Done' : 'Mark'}
          </Text>
        </Pressable>
      </View>
      <Text style={styles.meta}>{goal.notes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
  },
  pressed: {
    opacity: 0.9,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 5,
  },
  detail: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  check: {
    alignSelf: 'flex-start',
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.blue,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  checkDone: {
    backgroundColor: colors.blue,
  },
  checkText: {
    color: colors.blueSoft,
    fontSize: 12,
    fontWeight: '800',
  },
  checkTextDone: {
    color: '#edf4fa',
  },
  meta: {
    color: colors.faint,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 14,
  },
});
