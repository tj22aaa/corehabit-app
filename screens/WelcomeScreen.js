import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import ScreenShell from '../components/ScreenShell';
import { colors } from '../styles/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScreenShell>
      <View style={styles.hero}>
        <Text style={styles.appName}>CoreHabit</Text>
        <Text style={styles.tagline}>
          plan your fitness journey, build healthier routines.
        </Text>
      </View>

      <View style={styles.descriptionPanel}>
        <Text style={styles.description}>
          CoreHabit turns daily fitness, nutrition, hydration and recovery goals
          into a clear plan that can be completed, edited and reviewed over
          time.
        </Text>
      </View>

      <AppButton
        label="Let's Get Started"
        onPress={() => navigation.navigate('TodayPlan')}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 320,
    justifyContent: 'center',
  },
  appName: {
    color: colors.text,
    fontSize: 46,
    fontWeight: '800',
    letterSpacing: 0,
  },
  tagline: {
    color: colors.blueSoft,
    fontSize: 17,
    lineHeight: 25,
    marginTop: 10,
  },
  descriptionPanel: {
    borderLeftWidth: 4,
    borderLeftColor: colors.blue,
    marginBottom: 22,
    paddingLeft: 16,
  },
  description: {
    color: '#d1d8df',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
});
