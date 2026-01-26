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


type WishInputScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'WishInput'>;
  route: RouteProp<RootStackParamList, 'WishInput'>;
};

const WishInputScreen: React.FC<WishInputScreenProps> = ({ navigation, route }) => {
  const { date } = route.params;
  const [wish, setWish] = useState('');

  const loadExistingWish = useCallback(async () => {
    const entry = await storage.getDailyEntry(date);
    if (entry?.wish) {
      setWish(entry.wish);
    }
  }, [date]);

  useEffect(() => {
    loadExistingWish();
  }, [loadExistingWish]);

  const handleSave = async () => {
    await storage.saveDailyEntry(date, { wish });
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
        <Text style={styles.headerTitle}>Today's Wish</Text>
        <View style={styles.headerSpacer} />
      </View>


      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.icon}>✨</Text>
        <Text style={styles.title}>What do you wish for today?</Text>
        <Text style={styles.subtitle}>
          Express your deepest hope or desire. Whether you call it prayer, intention, or manifestation—your wish matters.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="I wish for..."
          value={wish}
          onChangeText={setWish}
          multiline
          placeholderTextColor="#B8A9CC"
          autoFocus
        />

        <View style={styles.examplesContainer}>
          <Text style={styles.examplesTitle}>Examples:</Text>
          <Text style={styles.exampleText}>• Peace of mind throughout this day</Text>
          <Text style={styles.exampleText}>• Strength to face my challenges with grace</Text>
          <Text style={styles.exampleText}>• A moment of deep connection with someone I love</Text>
          <Text style={styles.exampleText}>• Clarity to make the right decision</Text>
        </View>
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
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 20,
  //   //paddingTop: 60,
  //   paddingBottom: 20,
  //   backgroundColor: '#FFFFFF',
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#E8DFF5',
  // },
header: {
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 1,
  borderBottomColor: '#E8DFF5',
  padding: 20,
  // paddingHorizontal: 20,
  // paddingBottom: 15,
},
backButton: {
  alignSelf: 'flex-start',
  //paddingVertical: 8,
},

headerTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#2D1B4E',
  textAlign: 'center',
  marginTop: 5,
},


  // backButton: {
  //   paddingVertical: 8,
  // },
  backText: {
    fontSize: 16,
    color: '#9B6FDD',
    fontWeight: '600',
  },
  // headerTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#2D1B4E',
  // },
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
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    //paddingBottom: 30,
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
    elevation: 3,
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

export default WishInputScreen;
