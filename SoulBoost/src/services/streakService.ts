import { DailyEntry, StreakInfo } from '../types';
import { storage } from '../utils/storage';
import { dateUtils } from '../utils/dateUtils';

/**
 * Service for calculating and managing user streaks.
 * A streak represents consecutive days where the user has completed all daily requirements.
 */
export const streakService = {
  /**
   * Checks if a daily entry is complete (all requirements fulfilled).
   * A day is complete when:
   * - All 4 gratitude entries are filled
   * - A goal is set
   * - A wish is set
   *
   * @param entry - The daily entry to check
   * @returns true if the day is fully complete, false otherwise
   */
  isDayComplete(entry: DailyEntry | null): boolean {
    if (!entry) {
      return false;
    }

    // Check if all 4 gratitudes are filled (non-empty strings)
    const hasAllGratitudes =
      entry.gratitudes &&
      entry.gratitudes.filter(g => g && g.trim().length > 0).length === 4;

    // Check if goal is set
    const hasGoal = Boolean(entry.goal && entry.goal.trim().length > 0);

    // Check if wish is set
    const hasWish = Boolean(entry.wish && entry.wish.trim().length > 0);

    return Boolean(hasAllGratitudes && hasGoal && hasWish);
  },

  /**
   * Calculates the current streak by iterating backwards through completed days.
   * The streak starts from today (if complete) or yesterday (if today isn't complete yet)
   * and counts consecutive completed days.
   *
   * @param entries - Record of all daily entries indexed by date (YYYY-MM-DD)
   * @returns StreakInfo object with streak details
   */
  calculateStreak(entries: Record<string, DailyEntry>): StreakInfo {
    const today = dateUtils.getTodayString();
    const yesterday = dateUtils.getYesterdayString();

    const todayEntry = entries[today] || null;
    const isTodayComplete = this.isDayComplete(todayEntry);

    // Determine the starting point for counting the streak
    // If today is complete, start from today
    // If today is not complete, check if yesterday was complete to continue the streak
    let currentDate: string;
    let streak = 0;

    if (isTodayComplete) {
      // Today is complete, start counting from today
      currentDate = today;
    } else {
      // Today isn't complete yet, check from yesterday
      currentDate = yesterday;
    }

    // Count consecutive completed days going backwards
    while (true) {
      const entry = entries[currentDate] || null;

      if (this.isDayComplete(entry)) {
        streak++;
        currentDate = dateUtils.getPreviousDateString(currentDate);
      } else {
        break;
      }

      // Safety limit to prevent infinite loops (max 1 year of streak)
      if (streak > 365) {
        break;
      }
    }

    // Determine if streak is at risk
    // Streak is at risk if:
    // - User had a streak (yesterday or before was complete)
    // - Today is not yet complete
    const yesterdayEntry = entries[yesterday] || null;
    const wasYesterdayComplete = this.isDayComplete(yesterdayEntry);
    const isStreakAtRisk = !isTodayComplete && wasYesterdayComplete && streak > 0;

    // Find the last completed date
    let lastCompletedDate: string | null = null;
    if (isTodayComplete) {
      lastCompletedDate = today;
    } else if (wasYesterdayComplete) {
      lastCompletedDate = yesterday;
    } else if (streak > 0) {
      // Find the most recent completed date
      const sortedDates = Object.keys(entries).sort().reverse();
      for (const date of sortedDates) {
        if (this.isDayComplete(entries[date])) {
          lastCompletedDate = date;
          break;
        }
      }
    }

    return {
      currentStreak: streak,
      lastCompletedDate,
      isTodayComplete,
      isStreakAtRisk,
    };
  },

  /**
   * Fetches the current streak information from storage.
   * This is the main function to call from components.
   *
   * @returns Promise resolving to StreakInfo
   */
  async getStreakInfo(): Promise<StreakInfo> {
    const appState = await storage.getAppState();
    return this.calculateStreak(appState.entries);
  },

  /**
   * Returns an encouraging message based on the current streak status.
   *
   * @param streakInfo - The current streak information
   * @returns A motivational message string
   */
  getStreakMessage(streakInfo: StreakInfo): string {
    const { currentStreak, isTodayComplete, isStreakAtRisk } = streakInfo;

    if (currentStreak === 0) {
      return "Start your streak today! 🌱";
    }

    if (isStreakAtRisk) {
      return `Complete today to keep your ${currentStreak}-day streak! ⏰`;
    }

    if (isTodayComplete) {
      if (currentStreak === 1) {
        return "Great start! Day 1 complete! 🎉";
      } else if (currentStreak < 7) {
        return `${currentStreak} days strong! Keep going! 💪`;
      } else if (currentStreak < 30) {
        return `Amazing! ${currentStreak}-day streak! 🔥`;
      } else if (currentStreak < 100) {
        return `Incredible! ${currentStreak} days of consistency! ⭐`;
      } else {
        return `Legendary! ${currentStreak}-day streak! 🏆`;
      }
    }

    return `${currentStreak}-day streak! Complete today to continue! ✨`;
  },
};
