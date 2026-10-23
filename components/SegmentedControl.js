import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../styles/theme';

export default function SegmentedControl({ options, value, onChange }) {
  return (
    <View style={styles.row}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            style={[styles.option, selected && styles.selected]}
            onPress={() => onChange(option)}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  option: {
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  selected: {
    borderColor: colors.blue,
    backgroundColor: colors.blueDark,
  },
  text: {
    color: colors.faint,
    fontSize: 13,
    fontWeight: '800',
  },
  selectedText: {
    color: colors.blueSoft,
  },
});
