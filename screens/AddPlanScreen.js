import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FormField from '../components/FormField';
import ScreenShell from '../components/ScreenShell';
import SegmentedControl from '../components/SegmentedControl';
import { categories } from '../data/initialGoals';
import { colors, spacing } from '../styles/theme';
import { useGoals } from '../context/GoalContext';

const defaultDetails = {
  Workout: { exercises: '', intensity: '' },
  Nutrition: { mealType: '', calories: '' },
  Hydration: { unit: '', reminder: '' },
  Recovery: { sleepTarget: '', recoveryFocus: '' },
};

export default function AddPlanScreen({ navigation }) {
  const { addGoal } = useGoals();
  const [category, setCategory] = useState('Workout');
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [notes, setNotes] = useState('');
  const [details, setDetails] = useState(defaultDetails);

  function updateDetail(key, value) {
    setDetails((current) => ({
      ...current,
      [category]: {
        ...current[category],
        [key]: value,
      },
    }));
  }

  function savePlan() {
    addGoal({
      category,
      title: title.trim() || `${category} Plan`,
      target: target.trim() || 'Target not set',
      notes: notes.trim() || 'No notes added.',
      details: details[category],
    });
    navigation.navigate('TodayPlan');
  }

  const selectedDetails = details[category];

  return (
    <ScreenShell>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Add New Plan</Text>
      </View>

      <View style={styles.formPanel}>
        <Text style={styles.label}>Category</Text>
        <SegmentedControl
          options={categories}
          value={category}
          onChange={setCategory}
        />

        <FormField
          label="Plan title"
          value={title}
          onChangeText={setTitle}
          placeholder="Evening mobility routine"
        />
        <FormField
          label="Target amount or duration"
          value={target}
          onChangeText={setTarget}
          placeholder="20 minutes, 3 litres, 110g protein"
        />
        {category === 'Workout' && (
          <>
            <FormField
              label="Exercises"
              value={selectedDetails.exercises}
              onChangeText={(value) => updateDetail('exercises', value)}
              placeholder="Squats, push-ups, rows"
            />
            <FormField
              label="Intensity"
              value={selectedDetails.intensity}
              onChangeText={(value) => updateDetail('intensity', value)}
              placeholder="Low, moderate or high"
            />
          </>
        )}

        {category === 'Nutrition' && (
          <>
            <FormField
              label="Meal type"
              value={selectedDetails.mealType}
              onChangeText={(value) => updateDetail('mealType', value)}
              placeholder="Breakfast, lunch, dinner"
            />
            <FormField
              label="Calories or macro target"
              value={selectedDetails.calories}
              onChangeText={(value) => updateDetail('calories', value)}
              placeholder="650 kcal or high protein"
            />
          </>
        )}

        {category === 'Hydration' && (
          <>
            <FormField
              label="Unit"
              value={selectedDetails.unit}
              onChangeText={(value) => updateDetail('unit', value)}
              placeholder="Litres or millilitres"
            />
            <FormField
              label="Reminder plan"
              value={selectedDetails.reminder}
              onChangeText={(value) => updateDetail('reminder', value)}
              placeholder="Morning, afternoon, evening"
            />
          </>
        )}

        {category === 'Recovery' && (
          <>
            <FormField
              label="Sleep target"
              value={selectedDetails.sleepTarget}
              onChangeText={(value) => updateDetail('sleepTarget', value)}
              placeholder="8 hours"
            />
            <FormField
              label="Recovery focus"
              value={selectedDetails.recoveryFocus}
              onChangeText={(value) => updateDetail('recoveryFocus', value)}
              placeholder="Stretching, sleep, rest day"
            />
          </>
        )}

        <FormField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Add anything useful for this plan"
          multiline
        />
      </View>

      <AppButton label="Save Plan" onPress={savePlan} />
      <AppButton
        label="Back to Plan"
        variant="secondary"
        onPress={() => navigation.navigate('TodayPlan')}
      />
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
