import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, spacing } from '../styles/theme';

export default function AppButton({
  label,
  onPress,
  variant = 'primary',
  compact = false,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        compact && styles.compact,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          variant === 'secondary' && styles.secondaryText,
          variant === 'danger' && styles.dangerText,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: spacing.radius,
    backgroundColor: colors.blue,
    marginTop: 12,
    paddingHorizontal: 18,
  },
  compact: {
    minHeight: 40,
    marginTop: 0,
    paddingHorizontal: 14,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.danger,
  },
  pressed: {
    opacity: 0.82,
  },
  text: {
    color: '#edf4fa',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryText: {
    color: colors.text,
  },
  dangerText: {
    color: colors.danger,
  },
});
