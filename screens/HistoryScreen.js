import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import ScreenShell from '../components/ScreenShell';
import SegmentedControl from '../components/SegmentedControl';
import { categories } from '../data/initialGoals';
import { colors, spacing } from '../styles/theme';
import { useGoals } from '../context/GoalContext';

const dayPageSize = 2;

function groupByDate(goals) {
  return goals.reduce((groups, goal) => {
    if (!groups[goal.date]) {
      groups[goal.date] = [];
    }
    groups[goal.date].push(goal);
    return groups;
  }, {});
}

export default function HistoryScreen({ navigation }) {
  const { goals, today } = useGoals();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);

  const groupedDays = useMemo(() => {
    let filtered = [...goals];
    if (categoryFilter !== 'All') {
      filtered = filtered.filter((goal) => goal.category === categoryFilter);
    }
    if (statusFilter === 'Done') {
      filtered = filtered.filter((goal) => goal.completed);
    }
    if (statusFilter === 'Open') {
      filtered = filtered.filter((goal) => !goal.completed);
    }

    const groups = groupByDate(filtered);
    const dayKeys = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    return dayKeys.map((date) => ({
      date,
      goals: groups[date],
    }));
  }, [categoryFilter, goals, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(groupedDays.length / dayPageSize));
  const safePage = Math.min(page, totalPages);
  const visibleDays = groupedDays.slice(
    (safePage - 1) * dayPageSize,
    safePage * dayPageSize
  );

  return (
    <ScreenShell>
      <View style={styles.headerBlock}>
        <Text style={styles.screenTitle}>Goal History</Text>
        <Text style={styles.summary}>
          Review completed and incomplete plans by day.
        </Text>
      </View>

      <Text style={styles.controlLabel}>Category</Text>
      <SegmentedControl
        options={['All', ...categories]}
        value={categoryFilter}
        onChange={(value) => {
          setCategoryFilter(value);
          setPage(1);
        }}
      />

      <Text style={styles.controlLabel}>Status</Text>
      <SegmentedControl
        options={['All', 'Done', 'Open']}
        value={statusFilter}
        onChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
      />

      {visibleDays.map((day) => (
        <View key={day.date} style={styles.dayGroup}>
          <Text style={styles.dayTitle}>
            {day.date === today ? `Today - ${day.date}` : day.date}
          </Text>
          {day.goals.map((goal) => (
            <Pressable
              key={goal.id}
              style={styles.historyCard}
              onPress={() =>
                navigation.navigate('GoalDetail', { goalId: goal.id })
              }
            >
              <View style={styles.historyTopRow}>
                <Text style={styles.historyTitle}>{goal.title}</Text>
                <Text
                  style={[
                    styles.statusPill,
                    goal.completed && styles.statusPillDone,
                  ]}
                >
                  {goal.completed ? 'Done' : 'Open'}
                </Text>
              </View>
              <Text style={styles.historyMeta}>
                {goal.category} - {goal.target}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}

      {visibleDays.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No history matches this view.</Text>
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
  dayGroup: {
    marginBottom: 18,
  },
  dayTitle: {
    color: colors.blueSoft,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  historyCard: {
    borderRadius: spacing.radius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 10,
  },
  historyTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  historyTitle: {
    flex: 1,
    color: colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  statusPill: {
    overflow: 'hidden',
    borderRadius: spacing.radius,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.faint,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusPillDone: {
    borderColor: colors.blue,
    color: colors.blueSoft,
  },
  historyMeta: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 7,
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
