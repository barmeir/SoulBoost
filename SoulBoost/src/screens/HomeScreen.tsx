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
import { SafeAreaView } from 'react-native-safe-area-context';


import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, JFTContent, DailyEntry } from '../types';
import { dateUtils } from '../utils/dateUtils';
import { jftService } from '../services/jftService';
import { storage } from '../utils/storage';
import { scale, moderateScale, isSmallScreen, isLargeScreen } from '../utils/responsive';
//
type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#9B6FDD" />
        }
      >
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi {userName || 'there'}! 👋</Text>
        <Text style={styles.notePrivacy}>* Your information stays with you. All data is anonymous, private, and stored only on this device — never on our servers.</Text>
        <Text style={styles.date}>{dateUtils.formatDisplayDate(today)}</Text>
        <Text style={styles.motivationalMessage}>{motivationalMessage}</Text>
      </View>
        <Text style={styles.jftTitle}>Just for Today</Text>

      <TouchableOpacity
        style={styles.jftCard}
        onPress={handleJFTPress}
        activeOpacity={0.8}
        disabled={!jftContent}
      >
        {isLoadingJFT ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#9B6FDD" />
            <Text style={styles.loadingText}>Loading today's inspiration...</Text>
          </View>
        ) : jftContent ? (
          <>
        <Text style={styles.jftTitle}>{jftContent.title}</Text>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  contentContainer: {
    padding: scale(20),
    paddingBottom: scale(40),
  },
  header: {
    marginTop: scale(10),
    marginBottom: scale(24),
  },
  greeting: {
    fontSize: moderateScale(24),
    color: '#2D1B4E',
    fontWeight: 'bold',
    margin: scale(8),
    
  },
  notePrivacy: {
    fontSize: moderateScale(10),
    color: '#554c60ff',
    fontStyle: 'italic',
    marginBottom: scale(8),
  },  
  date: {
    fontSize: moderateScale(16),
    color: '#7B4FD4',
    fontWeight: '600',
    marginBottom: scale(8),
  },

  motivationalMessage: {
    backgroundColor: '#f4eca6ff',
    borderRadius: scale(16),
    fontSize: moderateScale(20),
    borderColor: '#f3ce7dff',
    borderWidth: scale(1),
    color: '#2D1B4E',
    fontWeight: '500',
    lineHeight: scale(28),
    textAlign: 'center',
    alignContent: 'center',
    padding: scale(4),

  },
  jftCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: scale(24),
    elevation: 1,
    shadowColor: '#9B6FDD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: scale(8),
  },
  jftTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#2D1B4E',
    marginBottom: scale(12),
  },
  jftPreview: {
    fontSize: moderateScale(15),
    color: '#5A4A6A',
    lineHeight: scale(16),
    marginBottom: scale(12),
  },
  tapToRead: {
    fontSize: moderateScale(14),
    color: '#9B6FDD',
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(20),
  },
  loadingText: {
    fontSize: moderateScale(14),
    color: '#9B6FDD',
    marginLeft: scale(12),
  },
  errorText: {
    fontSize: moderateScale(14),
    color: '#D4766A',
    fontStyle: 'italic',
  },
  actionsSection: {
    marginBottom: scale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#2D1B4E',
    marginBottom: scale(16),
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: scale(12),
    padding: scale(16),
    marginBottom: scale(12),
    borderLeftWidth: scale(4),
    borderLeftColor: '#9B6FDD',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: scale(4),
  },
  completedCard: {
    borderLeftColor: '#6BC89B',
    backgroundColor: '#F0F9F5',
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  actionIcon: {
    fontSize: moderateScale(24),
    marginRight: scale(10),
  },
  actionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#2D1B4E',
    flex: 1,
  },
  checkmark: {
    fontSize: moderateScale(20),
    color: '#6BC89B',
    fontWeight: 'bold',
  },
  actionDescription: {
    fontSize: moderateScale(14),
    color: '#5A4A6A',
    lineHeight: scale(20),
    marginLeft: scale(34),
  },
  historyButton: {
    backgroundColor: '#E8DFF5',
    borderRadius: scale(12),
    padding: scale(18),
    alignItems: 'center',
  },
  historyButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#7B4FD4',
  },
});

export default HomeScreen;
