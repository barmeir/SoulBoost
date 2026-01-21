import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { dateUtils } from '../utils/dateUtils';

type JFTDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JFTDetail'>;
  route: RouteProp<RootStackParamList, 'JFTDetail'>;
};

const JFTDetailScreen: React.FC<JFTDetailScreenProps> = ({ navigation, route }) => {
  const { date, content } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.date}>{dateUtils.formatDisplayDate(date)}</Text>
        <Text style={styles.title}>{content.title}</Text>
        <View style={styles.divider} />
        <Text style={styles.content}>{content.content}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  header: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  date: {
    fontSize: 14,
    color: '#9B6FDD',
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D1B4E',
    marginBottom: 16,
  },
  divider: {
    height: 2,
    backgroundColor: '#E8DFF5',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: '#5A4A6A',
    lineHeight: 26,
  },
});

export default JFTDetailScreen;
