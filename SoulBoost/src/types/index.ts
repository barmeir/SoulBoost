export interface JFTContent {
  date: string;
  title: string;
  quote: string;
  reference: string;
  fullContent: string;
  justForToday: string;
  preview: string;
}

export interface DailyEntry {
  date: string;
  gratitudes: string[];
  goal: string;
  wish: string;
  jftContent: JFTContent;
}

/**
 * Information about the user's current streak.
 * A streak counts consecutive days where all daily requirements are completed.
 */
export interface StreakInfo {
  /** The number of consecutive days completed */
  currentStreak: number;
  /** The last date that was fully completed (YYYY-MM-DD format) */
  lastCompletedDate: string | null;
  /** Whether today has been fully completed */
  isTodayComplete: boolean;
  /** Whether the streak is at risk (yesterday wasn't completed and today isn't yet) */
  isStreakAtRisk: boolean;
}

export interface AppState {
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  userName?: string;
  entries: Record<string, DailyEntry>;
}

export type RootStackParamList = {
  Onboarding: undefined;
  NameInput: undefined;
  Home: undefined;
  JFTDetail: { date: string; content: JFTContent };
  GratitudeInput: { date: string };
  GoalInput: { date: string };
  WishInput: { date: string };
  History: undefined;
};
