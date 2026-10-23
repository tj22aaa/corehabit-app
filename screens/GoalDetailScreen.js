import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FormField from '../components/FormField';
import ScreenShell from '../components/ScreenShell';
import SegmentedControl from '../components/SegmentedControl';
import { categories } from '../data/initialGoals';
import { colors, spacing } from '../styles/theme';
import { useGoals } from '../context/GoalContext';

const blankDetails = {
  Workout: { exercises: '', intensity: '' },
  Nutrition: { mealType: '', calories: '' },
  Hydration: { unit: '', reminder: '' },
  Recovery: { sleepTarget: '', recoveryFocus: '' },
};

function detailKeys(category) {
  if (category === 'Workout') {
    return [
      ['exercises', 'Exercises'],
      ['intensity', 'Intensity'],
    ];
  }
  if (category === 'Nutrition') {
    return [
      ['mealType', 'Meal type'],
      ['calories', 'Calories or macro target'],
    ];
  }
  if (category === 'Hydration') {
    return [
      ['unit', 'Unit'],
      ['reminder', 'Reminder plan'],
    ];
  }
  return [
    ['sleepTarget', 'Sleep target'],
    ['recoveryFocus', 'Recovery focus'],
  ];
}

export default function GoalDetailScreen({ navigation, route }) {
  const { goals, updateGoal, deleteGoal, toggleComplete } = useGoals();
  const goal = useMemo(
    () => goals.find((item) => item.id === route.params.goalId),
    [goals, route.params.goalId]
  );

  const [category, setCategory] = useState(goal?.category || 'Workout');
  const [title, setTitle] = useState(goal?.title || '');
  const [target, setTarget] = useState(goal?.target || '');
  const [notes, setNotes] = useState(goal?.notes || '');
  const [details, setDetails] = useState({
    ...blankDetails,
    [goal?.category || 'Workout']: goal?.details || {},
  });

  if (!goal) {
    return (
      <ScreenShell>
        <Text style={styles.screenTitle}>Goal removed</Text>
        <Text style={styles.bodyText}>
          This plan is no longer available in the current list.
        </Text>
        <AppButton
          label="Back to Plan"
          onPress={() => navigation.navigate('TodayPlan')}
        />
      </ScreenShell>
    );
  }

  function updateDetail(key, value) {
    setDetails((current) => ({
      ...current,
      [category]: {
        ...current[category],
        [key]: value,
      },
    }));
  }

  function saveChanges() {
    updateGoal(goal.id, {
      category,
      title: title.trim() || `${category} Plan`,
      target: target.trim() || 'Target not set',
      notes: notes.trim() || 'No notes added.',
      details: details[category] || {},
    });
    navigation.navigate('TodayPlan');
  }

  function confirmDelete() {
    Alert.alert(
      'Delete plan',
      'Do you want to remove this goal from CoreHabit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteGoal(goal.id);
            navigation.navigate('TodayPlan');
          },
        },
      ]
    );
  }

  return (
    <ScreenShell>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Goal Details</Text>
        <Text style={styles.statusText}>
          {goal.completed ? 'Completed' : 'Still planned'}
        </Text>
      </View>

      <View style={styles.formPanel}>
        <Text style={styles.label}>Category</Text>
        <SegmentedControl
          options={categories}
          value={category}
          onChange={setCategory}
        />

        <FormField label="Title" value={title} onChangeText={setTitle} />
        <FormField label="Target" value={target} onChangeText={setTarget} />

        {detailKeys(category).map(([key, label]) => (
          <FormField
            key={key}
            label={label}
            value={(details[category] && details[category][key]) || ''}
            onChangeText={(value) => updateDetail(key, value)}
          />
        ))}

        <FormField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
        />
      </View>

      <AppButton label="Save Changes" onPress={saveChanges} />
      <AppButton
        label={goal.completed ? 'Mark Incomplete' : 'Mark Done'}
        variant="secondary"
        onPress={() => toggleComplete(goal.id)}
      />
      <AppButton label="Delete Plan" variant="danger" onPress={confirmDelete} />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginBottom: 18,
  },
  screenTitle: {
    color: colors.text,
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: 0,
  },
  statusText: {
    color: colors.blueSoft,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },
  bodyText: {
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  formPanel: {
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 10,
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
});
