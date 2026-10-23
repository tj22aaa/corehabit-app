import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { currentPlanDate, initialGoalSeed } from '../data/initialGoals';

const GoalContext = createContext(null);
const storageKey = 'corehabit-goals';

function buildInitialGoals() {
  return initialGoalSeed.map((goal, index) => ({
    ...goal,
    createdAt: index + 1,
  }));
}

function makeId() {
  return `goal-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function GoalProvider({ children }) {
  const [goals, setGoals] = useState(buildInitialGoals);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSavedGoals() {
      try {
        const savedGoals = await AsyncStorage.getItem(storageKey);
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals));
        }
      } catch (error) {
        console.log('Could not load saved CoreHabit goals.', error);
      } finally {
        setLoaded(true);
      }
    }

    loadSavedGoals();
  }, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    async function saveGoals() {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(goals));
      } catch (error) {
        console.log('Could not save CoreHabit goals.', error);
      }
    }

    saveGoals();
  }, [goals, loaded]);

  function addGoal(goal) {
    const newGoal = {
      ...goal,
      id: makeId(),
      date: currentPlanDate,
      completed: false,
      createdAt: Date.now(),
    };
    setGoals((current) => [newGoal, ...current]);
    return newGoal;
  }

  function updateGoal(goalId, updates) {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    );
  }

  function deleteGoal(goalId) {
    setGoals((current) => current.filter((goal) => goal.id !== goalId));
  }

  function toggleComplete(goalId) {
    setGoals((current) =>
      current.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  }

  const value = useMemo(
    () => ({
      goals,
      today: currentPlanDate,
      addGoal,
      updateGoal,
      deleteGoal,
      toggleComplete,
      loaded,
    }),
    [goals, loaded]
  );

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
}

export function useGoals() {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error('useGoals must be used inside GoalProvider');
  }
  return context;
}
