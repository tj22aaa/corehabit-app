import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import TodayPlanScreen from '../screens/TodayPlanScreen';
import AddPlanScreen from '../screens/AddPlanScreen';
import GoalDetailScreen from '../screens/GoalDetailScreen';
import HistoryScreen from '../screens/HistoryScreen';
import { colors } from '../styles/theme';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surfaceDark },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'CoreHabit' }} />
        <Stack.Screen name="TodayPlan" component={TodayPlanScreen} options={{ title: 'Today' }} />
        <Stack.Screen name="AddPlan" component={AddPlanScreen} options={{ title: 'Add Plan' }} />
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen} options={{ title: 'Goal Details' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Goal History' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
