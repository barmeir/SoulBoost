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

type GratitudeInputScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'GratitudeInput'>;
  route: RouteProp<RootStackParamList, 'GratitudeInput'>;
};

const GratitudeInputScreen: React.FC<GratitudeInputScreenProps> = ({ navigation, route }) => {
  const { date } = route.params;
  const [gratitudes, setGratitudes] = useState<string[]>(['', '', '', '']);

  useEffect(() => {
    loadExistingGratitudes();
  }, []);

  const loadExistingGratitudes = async () => {
    const entry = await storage.getDailyEntry(date);
    if (entry?.gratitudes) {
      setGratitudes(entry.gratitudes);
    }
  };

  const updateGratitude = (index: number, value: string) => {
    const newGratitudes = [...gratitudes];
    newGratitudes[index] = value;
    setGratitudes(newGratitudes);
  };

  const handleSave = async () => {
    await storage.saveDailyEntry(date, { gratitudes });
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
        <Text style={styles.headerTitle}>Gratitude</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.icon}>🙏</Text>
        <Text style={styles.title}>What are you grateful for today?</Text>
        <Text style={styles.subtitle}>
          Taking a moment to appreciate the good things in life can transform your perspective.
        </Text>

        {gratitudes.map((gratitude, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{index + 1}.</Text>
            <TextInput
              style={styles.input}
              placeholder={`I'm grateful for...`}
              value={gratitude}
              onChangeText={(text) => updateGratitude(index, text)}
              multiline
              placeholderTextColor="#B8A9CC"
            />
          </View>
        ))}
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
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9B6FDD',
    marginRight: 12,
    marginTop: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2D1B4E',
    minHeight: 60,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: '#E8DFF5',
  },
});

export default GratitudeInputScreen;
