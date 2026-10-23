import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import GoalCard from '../components/GoalCard';
import ScreenShell from '../components/ScreenShell';
import SegmentedControl from '../components/SegmentedControl';
import { categories } from '../data/initialGoals';
import { colors, spacing } from '../styles/theme';
import { useGoals } from '../context/GoalContext';

const pageSize = 5;
const sortOptions = ['Open First', 'Done First'];

function sortGoals(goals, sortMode) {
  const copy = [...goals];
  if (sortMode === 'Done First') {
    return copy.sort((a, b) => Number(b.completed) - Number(a.completed));
  }
  return copy.sort((a, b) => Number(a.completed) - Number(b.completed));
}

export default function TodayPlanScreen({ navigation }) {
  const { goals, today, toggleComplete, loaded } = useGoals();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortMode, setSortMode] = useState('Open First');
  const [page, setPage] = useState(1);

  const todayGoals = useMemo(
    () => goals.filter((goal) => goal.date === today),
    [goals, today]
  );

  const filteredGoals = useMemo(() => {
    const filtered =
      categoryFilter === 'All'
        ? todayGoals
        : todayGoals.filter((goal) => goal.category === categoryFilter);
    return sortGoals(filtered, sortMode);
  }, [categoryFilter, sortMode, todayGoals]);

  const totalPages = Math.max(1, Math.ceil(filteredGoals.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleGoals = filteredGoals.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );
  const completedCount = todayGoals.filter((goal) => goal.completed).length;

  const groups = categories
    .map((category) => ({
      category,
      goals: visibleGoals.filter((goal) => goal.category === category),
    }))
    .filter((group) => group.goals.length > 0);

  return (
    <ScreenShell>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Today's Plan</Text>
        <Text style={styles.summary}>
          {completedCount} of {todayGoals.length} goals completed
        </Text>
      </View>

      {!loaded && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Loading saved plans...</Text>
        </View>
      )}

      <Text style={styles.controlLabel}>Filter</Text>
      <SegmentedControl
        options={['All', ...categories]}
        value={categoryFilter}
        onChange={(value) => {
          setCategoryFilter(value);
          setPage(1);
        }}
      />

      <Text style={styles.controlLabel}>Sort</Text>
      <SegmentedControl
        options={sortOptions}
        value={sortMode}
        onChange={(value) => {
          setSortMode(value);
          setPage(1);
        }}
      />

      {groups.map((group) => (
        <View key={group.category} style={styles.planGroup}>
          <Text style={styles.categoryLabel}>{group.category}</Text>
          {group.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onPress={() =>
                navigation.navigate('GoalDetail', { goalId: goal.id })
              }
              onToggle={() => toggleComplete(goal.id)}
            />
          ))}
        </View>
      ))}

      {visibleGoals.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No goals match this filter.</Text>
        </View>
      )}

      <View style={styles.pagingRow}>
        <AppButton
          label="Previous"
          compact
          variant="secondary"
          onPress={() => setPage(Math.max(1, safePage - 1))}
        />
        <Text style={styles.pageText}>
          Page {safePage} of {totalPages}
        </Text>
        <AppButton
          label="Next"
          compact
          variant="secondary"
          onPress={() => setPage(Math.min(totalPages, safePage + 1))}
        />
      </View>

      <AppButton
        label="Add New Plan"
        onPress={() => navigation.navigate('AddPlan')}
      />
      <AppButton
        label="View Goal History"
        variant="secondary"
        onPress={() => navigation.navigate('History')}
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
  summary: {
    color: colors.blueSoft,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  controlLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
  },
  planGroup: {
    marginBottom: 16,
  },
  categoryLabel: {
    color: colors.blueSoft,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  emptyBox: {
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
  },
  pagingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  pageText: {
    color: colors.faint,
    fontSize: 13,
    fontWeight: '800',
  },
});
