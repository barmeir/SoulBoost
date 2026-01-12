import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DailyEntry, JFTContent } from '../types';

const KEYS = {
  APP_STATE: '@SoulBoost:appState',
  ENTRIES: '@SoulBoost:entries',
  JFT_CACHE: '@SoulBoost:jftCache',
};

export const storage = {
  async getAppState(): Promise<AppState> {
    try {
      const data = await AsyncStorage.getItem(KEYS.APP_STATE);
      return data ? JSON.parse(data) : {
        hasCompletedOnboarding: false,
        notificationsEnabled: false,
        entries: {},
      };
    } catch (error) {
      console.error('Error getting app state:', error);
      return {
        hasCompletedOnboarding: false,
        notificationsEnabled: false,
        entries: {},
      };
    }
  },

  async saveAppState(state: Partial<AppState>): Promise<void> {
    try {
      const currentState = await this.getAppState();
      const newState = { ...currentState, ...state };
      await AsyncStorage.setItem(KEYS.APP_STATE, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving app state:', error);
    }
  },

  async getDailyEntry(date: string): Promise<DailyEntry | null> {
    try {
      const state = await this.getAppState();
      return state.entries[date] || null;
    } catch (error) {
      console.error('Error getting daily entry:', error);
      return null;
    }
  },

  async saveDailyEntry(date: string, entry: Partial<DailyEntry>): Promise<void> {
    try {
      const state = await this.getAppState();
      const currentEntry = state.entries[date] || { date, gratitudes: [], goal: '', wish: '' };
      state.entries[date] = { ...currentEntry, ...entry };
      await AsyncStorage.setItem(KEYS.APP_STATE, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving daily entry:', error);
    }
  },

  async getAllEntries(): Promise<DailyEntry[]> {
    try {
      const state = await this.getAppState();
      return Object.values(state.entries).sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (error) {
      console.error('Error getting all entries:', error);
      return [];
    }
  },

  async getCachedJFT(date: string): Promise<JFTContent | null> {
    try {
      const cache = await AsyncStorage.getItem(`${KEYS.JFT_CACHE}:${date}`);
      return cache ? JSON.parse(cache) : null;
    } catch (error) {
      console.error('Error getting cached JFT:', error);
      return null;
    }
  },

  async cacheJFT(date: string, content: JFTContent): Promise<void> {
    try {
      await AsyncStorage.setItem(`${KEYS.JFT_CACHE}:${date}`, JSON.stringify(content));
    } catch (error) {
      console.error('Error caching JFT:', error);
    }
  },
};
