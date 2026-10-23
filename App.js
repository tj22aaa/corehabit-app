import React from 'react';
import { GoalProvider } from './context/GoalContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <GoalProvider>
      <AppNavigator />
    </GoalProvider>
  );
}
