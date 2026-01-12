import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { storage } from '../utils/storage';

type GoalInputScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'GoalInput'>;
  route: RouteProp<RootStackParamList, 'GoalInput'>;
};

const GoalInputScreen: React.FC<GoalInputScreenProps> = ({ navigation, route }) => {
  const { date } = route.params;
  const [goal, setGoal] = useState('');

  useEffect(() => {
    loadExistingGoal();
  }, []);

  const loadExistingGoal = async () => {
    const entry = await storage.getDailyEntry(date);
    if (entry?.goal) {
      setGoal(entry.goal);
    }
  };

  const handleSave = async () => {
    await storage.saveDailyEntry(date, { goal });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Today's Goal</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.icon}>🎯</Text>
        <Text style={styles.title}>What's your goal for today?</Text>
        <Text style={styles.subtitle}>
          Setting a clear intention helps you focus your energy and accomplish what matters most.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Today, I will..."
          value={goal}
          onChangeText={setGoal}
          multiline
          placeholderTextColor="#B8A9CC"
          autoFocus
        />

        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Examples:</Text>
          <Text style={styles.exampleText}>• Complete my work project by 3pm</Text>
          <Text style={styles.exampleText}>• Exercise for 30 minutes</Text>
          <Text style={styles.exampleText}>• Call a friend I haven't spoken to in a while</Text>
          <Text style={styles.exampleText}>• Practice mindfulness for 10 minutes</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8DFF5',
  },
  backButton: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#9B6FDD',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D1B4E',
  },
  saveButton: {
    paddingVertical: 8,
  },
  saveText: {
    fontSize: 16,
    color: '#9B6FDD',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  icon: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D1B4E',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#5A4A6A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    fontSize: 16,
    color: '#2D1B4E',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: '#E8DFF5',
    marginBottom: 24,
  },
  examplesContainer: {
    backgroundColor: '#E8DFF5',
    borderRadius: 12,
    padding: 16,
  },
  examplesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7B4FD4',
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#5A4A6A',
    marginBottom: 4,
  },
});

export default GoalInputScreen;
