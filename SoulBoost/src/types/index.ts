export interface JFTContent {
  date: string;
  title: string;
  content: string;
  preview: string;
}

export interface DailyEntry {
  date: string;
  gratitudes: string[];
  goal: string;
  wish: string;
  jftContent?: JFTContent;
}

export interface AppState {
  hasCompletedOnboarding: boolean;
  notificationsEnabled: boolean;
  entries: Record<string, DailyEntry>;
}

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
  JFTDetail: { date: string; content: JFTContent };
  GratitudeInput: { date: string };
  GoalInput: { date: string };
  WishInput: { date: string };
  History: undefined;
};
