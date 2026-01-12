import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { storage } from '../utils/storage';

import OnboardingScreen from '../screens/OnboardingScreen';
import NameInputScreen from '../screens/NameInputScreen';
import HomeScreen from '../screens/HomeScreen';
import JFTDetailScreen from '../screens/JFTDetailScreen';
import GratitudeInputScreen from '../screens/GratitudeInputScreen';
import GoalInputScreen from '../screens/GoalInputScreen';
import WishInputScreen from '../screens/WishInputScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasUserName, setHasUserName] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    const appState = await storage.getAppState();
    setHasCompletedOnboarding(appState.hasCompletedOnboarding);
    setHasUserName(!!appState.userName);
    setIsLoading(false);
  };

  if (isLoading) {
    return null;
  }

  const getInitialRoute = (): keyof RootStackParamList => {
    if (!hasCompletedOnboarding) return 'Onboarding';
    if (!hasUserName) return 'NameInput';
    return 'Home';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F8F4FF' },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="NameInput" component={NameInputScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="JFTDetail" component={JFTDetailScreen} />
        <Stack.Screen name="GratitudeInput" component={GratitudeInputScreen} />
        <Stack.Screen name="GoalInput" component={GoalInputScreen} />
        <Stack.Screen name="WishInput" component={WishInputScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
