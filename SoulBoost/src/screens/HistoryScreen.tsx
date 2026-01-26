import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, DailyEntry } from '../types';
import { storage } from '../utils/storage';
import { dateUtils } from '../utils/dateUtils';
import { SafeAreaView } from 'react-native-safe-area-context';


type HistoryScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'History'>;
};

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    const allEntries = await storage.getAllEntries();
    setEntries(allEntries);
  };

  const toggleEntry = (date: string) => {
    setExpandedEntry(expandedEntry === date ? null : date);
  };

  const renderEntry = (entry: DailyEntry) => {
    const isExpanded = expandedEntry === entry.date;
    const hasContent = 
      (entry.gratitudes && entry.gratitudes.some(g => g)) ||
      entry.goal ||
      entry.wish;

    if (!hasContent) return null;

    return (
      <TouchableOpacity
        key={entry.date}
        style={styles.entryCard}
        onPress={() => toggleEntry(entry.date)}
        activeOpacity={0.7}
      >
        <View style={styles.entryHeader}>
          <Text style={styles.entryDate}>{dateUtils.formatDisplayDate(entry.date)}</Text>
          <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
        </View>

        {isExpanded && (
          <View style={styles.entryContent}>
            {entry.gratitudes && entry.gratitudes.some(g => g) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🙏 Gratitude</Text>
                {entry.gratitudes.filter(g => g).map((gratitude, index) => (
                  <Text key={index} style={styles.listItem}>• {gratitude}</Text>
                ))}
              </View>
            )}

            {entry.goal && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🎯 Goal</Text>
                <Text style={styles.content}>{entry.goal}</Text>
              </View>
            )}

            {entry.wish && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>✨ Wish</Text>
                <Text style={styles.content}>{entry.wish}</Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Journey</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {entries.length > 0 ? (
          <>
            <Text style={styles.subtitle}>
              Reflecting on your journey helps you see how far you've come.
            </Text>
            {entries.map(renderEntry)}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📖</Text>
            <Text style={styles.emptyTitle}>No Entries Yet</Text>
            <Text style={styles.emptyText}>
              Start your journey today by adding your gratitudes, goals, and wishes.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  placeholder: {
    width: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#5A4A6A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  entryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1B4E',
  },
  expandIcon: {
    fontSize: 24,
    color: '#9B6FDD',
    fontWeight: 'bold',
  },
  entryContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8DFF5',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7B4FD4',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#5A4A6A',
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: '#5A4A6A',
    lineHeight: 20,
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D1B4E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: '#5A4A6A',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 40,
  },
});

export default HistoryScreen;
