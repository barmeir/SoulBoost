import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { storage } from '../utils/storage';
import { notificationService } from '../services/notificationService';

type OnboardingScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Onboarding'>;
};

const { width } = Dimensions.get('window');

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Soul Boost',
      subtitle: 'Start your spark, Lift your spirit daily',
      description: 'A daily companion to help you cultivate gratitude, set intentions, and find inspiration through daily readings.',
    },
    {
      title: 'Daily Inspiration',
      subtitle: 'Just for Today',
      description: 'Receive daily readings from Narcotics Anonymous that provide wisdom, hope, and encouragement for your journey.',
    },
    {
      title: 'Express Gratitude',
      subtitle: 'Count Your Blessings',
      description: 'Record four things you\'re grateful for each day. Gratitude transforms your perspective and brings more joy into your life.',
    },
    {
      title: 'Set Your Intention',
      subtitle: 'Goals & Wishes',
      description: 'Write down your goal for today and express your deepest wish. Watch as your intentions manifest into reality.',
    },
    {
      title: 'Morning Reminders',
      subtitle: 'Start Each Day Right',
      description: 'Receive a gentle notification every morning at 8 AM to begin your day with positivity and purpose.',
    },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - request permissions and complete onboarding
      await notificationService.requestPermission();
      await notificationService.scheduleDailyNotification();
      await storage.saveAppState({ hasCompletedOnboarding: true });
      navigation.replace('Home');
    }
  };

  const handleSkip = async () => {
    await storage.saveAppState({ hasCompletedOnboarding: true });
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.stepContainer}>
          <Text style={styles.stepIndicator}>
            {currentStep + 1} / {steps.length}
          </Text>
          
          <View style={styles.content}>
            <Text style={styles.title}>{steps[currentStep].title}</Text>
            <Text style={styles.subtitle}>{steps[currentStep].subtitle}</Text>
            <Text style={styles.description}>{steps[currentStep].description}</Text>
          </View>

          <View style={styles.dotsContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {currentStep < steps.length - 1 && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextText}>
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingTop: 60,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#9B6FDD',
    fontWeight: '600',
    marginBottom: 40,
  },
  content: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D1B4E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7B4FD4',
    textAlign: 'center',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#5A4A6A',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D4C5E8',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#9B6FDD',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8DFF5',
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 16,
    color: '#9B6FDD',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#9B6FDD',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#9B6FDD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default OnboardingScreen;
