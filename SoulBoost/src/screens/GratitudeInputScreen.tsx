import React, { useState, useEffect, useCallback } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { storage } from '../utils/storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GRATITUDE_COUNT } from '../constants';


type GratitudeInputScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GratitudeInput'>;
  route: RouteProp<RootStackParamList, 'GratitudeInput'>;
};

const GratitudeInputScreen: React.FC<GratitudeInputScreenProps> = ({ navigation, route }) => {
  const { date } = route.params;
  const [gratitudes, setGratitudes] = useState<string[]>(['', '', '', '']);

  const loadExistingGratitudes = useCallback(async () => {
    const entry = await storage.getDailyEntry(date);

    console.debug('Loaded entry for date', date, ':', entry);
    console.debug('Existing gratitudes:', entry?.gratitudes);

    if (entry?.gratitudes && entry.gratitudes.length === GRATITUDE_COUNT) {
      setGratitudes(entry.gratitudes);
    }
  }, [date]);

  useEffect(() => {
    loadExistingGratitudes();
  }, [loadExistingGratitudes]);

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
    <SafeAreaView style={styles.container}>
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gratitude</Text>
        <View style={styles.headerSpacer} />
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

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingTop: 40,
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
    fontSize: 24,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#2D1B4E',
  },
  headerSpacer: {
    width: 60,
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
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#E8DFF5',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#9B6FDD',
    paddingHorizontal: 60,
    paddingVertical: 16,
    borderRadius: 30,
    minWidth: 200,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#9B6FDD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default GratitudeInputScreen;
