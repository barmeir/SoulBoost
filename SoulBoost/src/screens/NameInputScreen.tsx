import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { storage } from '../utils/storage';
import { scale, moderateScale } from '../utils/responsive';



type NameInputScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'NameInput'>;
};

const NameInputScreen: React.FC<NameInputScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');

  const handleContinue = async () => {
    if (name.trim()) {
      await storage.saveAppState({ userName: name.trim() });
      navigation.replace('Home');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>👋</Text>
        <Text style={styles.title}>Welcome to Soul Boost!</Text>
        <Text style={styles.subtitle}>
          Before we begin, what's your name?
        </Text>


        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#B8A9CC"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={handleContinue}
        />

        <Text style={styles.notePrivacy}>* Your information stays with you. All data is anonymous, private, and stored only on this device — never on our servers.</Text>
        

        <TouchableOpacity 
          onPress={handleContinue} 
          style={[styles.continueButton, !name.trim() && styles.disabledButton]}
          disabled={!name.trim()}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
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
    color: '#5A4A6A',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 26,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    fontSize: 18,
    color: '#2D1B4E',
    borderWidth: 2,
    borderColor: '#E8DFF5',
    marginBottom: 24,
    textAlign: 'center',
  },
    notePrivacy: {
      fontSize: moderateScale(10),
      color: '#554c60ff',
      fontStyle: 'italic',
      marginHorizontal: scale(4),
      marginBottom: scale(8),
    }, 
  continueButton: {
    backgroundColor: '#9B6FDD',
    paddingHorizontal: 60,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 3,
    shadowColor: '#9B6FDD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#D4C5E8',
    elevation: 0,
    shadowOpacity: 0,
  },
  continueText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default NameInputScreen;
