import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, JFTContent, DailyEntry } from '../types';
import { dateUtils } from '../utils/dateUtils';
import { jftService } from '../services/jftService';
import { storage } from '../utils/storage';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [today] = useState(dateUtils.getTodayString());
  const [motivationalMessage] = useState(dateUtils.getMotivationalMessage());
  const [jftContent, setJftContent] = useState<JFTContent | null>(null);
  const [isLoadingJFT, setIsLoadingJFT] = useState(true);
  const [dailyEntry, setDailyEntry] = useState<DailyEntry | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const loadJFTContent = useCallback(async () => {
    setIsLoadingJFT(true);
    const content = await jftService.fetchJFTContent(today);
    setJftContent(content);
    setIsLoadingJFT(false);
  }, [today]);

  const loadDailyEntry = useCallback(async () => {
    const entry = await storage.getDailyEntry(today);
    setDailyEntry(entry);
  }, [today]);

  const loadUserName = useCallback(async () => {
    const appState = await storage.getAppState();
    if (appState.userName) {
      setUserName(appState.userName);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadJFTContent();
    await loadDailyEntry();
    setRefreshing(false);
  };

  useEffect(() => {
    loadJFTContent();
    loadDailyEntry();
    loadUserName();
  }, [loadJFTContent, loadDailyEntry, loadUserName]);

  useFocusEffect(
    React.useCallback(() => {
      loadDailyEntry();
    }, [loadDailyEntry])
  );

  const handleJFTPress = () => {
    if (jftContent) {
      navigation.navigate('JFTDetail', { date: today, content: jftContent });
    }
  };

  const handleGratitudePress = () => {
    navigation.navigate('GratitudeInput', { date: today });
  };

  const handleGoalPress = () => {
    navigation.navigate('GoalInput', { date: today });
  };

  const handleWishPress = () => {
    navigation.navigate('WishInput', { date: today });
  };

  const handleHistoryPress = () => {
    navigation.navigate('History');
  };

  const isGratitudeComplete = dailyEntry?.gratitudes && dailyEntry.gratitudes.filter(g => g).length === 4;
  const isGoalComplete = dailyEntry?.goal && dailyEntry.goal.length > 0;
  const isWishComplete = dailyEntry?.wish && dailyEntry.wish.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#9B6FDD" />
      }
    >
      <View style={styles.header}>
        {userName && <Text style={styles.greeting}>Hi {userName}! 👋</Text>}
        <Text style={styles.notePrivacy}>Your information stays with you. All data is anonymous, private, and stored only on this device — never on our servers.</Text>
        <Text style={styles.date}>{dateUtils.formatDisplayDate(today)}</Text>
        <Text style={styles.motivationalMessage}>{motivationalMessage}</Text>
      </View>

      <TouchableOpacity
        style={styles.jftCard}
        onPress={handleJFTPress}
        activeOpacity={0.8}
        disabled={!jftContent}
      >
        <Text style={styles.jftTitle}>Just for Today</Text>
        {isLoadingJFT ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#9B6FDD" />
            <Text style={styles.loadingText}>Loading today's inspiration...</Text>
          </View>
        ) : jftContent ? (
          <>
            <Text style={styles.jftPreview}>{jftContent.preview}</Text>
            <Text style={styles.tapToRead}>Tap to read full message →</Text>
          </>
        ) : (
          <Text style={styles.errorText}>Unable to load content. Pull to refresh.</Text>
        )}
      </TouchableOpacity>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Today's Reflections</Text>

        <TouchableOpacity
          style={[styles.actionCard, isGratitudeComplete && styles.completedCard]}
          onPress={handleGratitudePress}
          activeOpacity={0.7}
        >
          <View style={styles.actionHeader}>
            <Text style={styles.actionIcon}>🙏</Text>
            <Text style={styles.actionTitle}>Gratitude</Text>
            {isGratitudeComplete && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.actionDescription}>
            {isGratitudeComplete
              ? "You've shared your gratitude today!"
              : "What are 4 things you're grateful for today?"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, isGoalComplete && styles.completedCard]}
          onPress={handleGoalPress}
          activeOpacity={0.7}
        >
          <View style={styles.actionHeader}>
            <Text style={styles.actionIcon}>🎯</Text>
            <Text style={styles.actionTitle}>Today's Goal</Text>
            {isGoalComplete && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.actionDescription}>
            {isGoalComplete
              ? dailyEntry?.goal
              : 'What do you want to accomplish today?'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, isWishComplete && styles.completedCard]}
          onPress={handleWishPress}
          activeOpacity={0.7}
        >
          <View style={styles.actionHeader}>
            <Text style={styles.actionIcon}>✨</Text>
            <Text style={styles.actionTitle}>Today's Wish</Text>
            {isWishComplete && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.actionDescription}>
            {isWishComplete
              ? dailyEntry?.wish
              : 'What do you wish for today?'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={handleHistoryPress}
        activeOpacity={0.7}
      >
        <Text style={styles.historyButtonText}>📖 View Your Journey</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    color: '#2D1B4E',
    fontWeight: 'bold',
    margin: 8,
  },
  notePrivacy: {
    fontSize: 8,
    color: '#827c89ff',
    fontStyle: 'italic',
    marginBottom: 12,
  },  
  date: {
    fontSize: 16,
    color: '#7B4FD4',
    fontWeight: '600',
    marginBottom: 8,
  },
  motivationalMessage: {
    fontSize: 20,
    color: '#2D1B4E',
    fontWeight: '600',
    lineHeight: 28,
    alignContent: 'center',
  },
  jftCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#9B6FDD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  jftTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D1B4E',
    marginBottom: 12,
  },
  jftPreview: {
    fontSize: 15,
    color: '#5A4A6A',
    lineHeight: 22,
    marginBottom: 12,
  },
  tapToRead: {
    fontSize: 14,
    color: '#9B6FDD',
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#9B6FDD',
    marginLeft: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#D4766A',
    fontStyle: 'italic',
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D1B4E',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#9B6FDD',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  completedCard: {
    borderLeftColor: '#6BC89B',
    backgroundColor: '#F0F9F5',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D1B4E',
    flex: 1,
  },
  checkmark: {
    fontSize: 20,
    color: '#6BC89B',
    fontWeight: 'bold',
  },
  actionDescription: {
    fontSize: 14,
    color: '#5A4A6A',
    lineHeight: 20,
    marginLeft: 34,
  },
  historyButton: {
    backgroundColor: '#E8DFF5',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  historyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7B4FD4',
  },
});

export default HomeScreen;
