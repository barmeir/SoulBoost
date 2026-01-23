import notifee, { 
  AndroidImportance, 
  AuthorizationStatus, 
  RepeatFrequency, 
  TriggerType 
} from '@notifee/react-native';
import { storage } from '../utils/storage';
import { StreakInfo } from '../types';

export const notificationService = {
  async requestPermission(): Promise<boolean> {
    try {
      const settings = await notifee.requestPermission();
      const granted = settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
      await storage.saveAppState({ notificationsEnabled: granted });
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  },

  async checkPermission(): Promise<boolean> {
    try {
      const settings = await notifee.getNotificationSettings();
      return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  },

  async createNotificationChannel(): Promise<string> {
    const channelId = await notifee.createChannel({
      id: 'daily-motivation',
      name: 'Daily Motivation',
      importance: AndroidImportance.HIGH,
    });
    return channelId;
  },

  async scheduleDailyNotification(): Promise<void> {
    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        console.log('No notification permission');
        return;
      }

      const channelId = await this.createNotificationChannel();

      // Cancel any existing notifications
      await notifee.cancelAllNotifications();

      // Create a trigger for 8:00 AM daily
      const trigger: any = {
        type: TriggerType.TIMESTAMP,
        timestamp: this.getNext8AMTimestamp(),
        repeatFrequency: RepeatFrequency.DAILY,
      };

      await notifee.createTriggerNotification(
        {
          title: '✨ Start Your Spark',
          body: 'Good morning! Open Soul Boost to lift your spirit today.',
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            importance: AndroidImportance.HIGH,
          },
        },
        trigger
      );

      console.log('Daily notification scheduled for 8:00 AM');
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  },

  getNext8AMTimestamp(): number {
    const now = new Date();
    const next8AM = new Date();
    next8AM.setHours(8, 0, 0, 0);

    // If 8 AM has already passed today, schedule for tomorrow
    if (now.getTime() >= next8AM.getTime()) {
      next8AM.setDate(next8AM.getDate() + 1);
    }

    return next8AM.getTime();
  },

  async cancelAllNotifications(): Promise<void> {
    try {
      await notifee.cancelAllNotifications();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  },

  /**
   * Shows an immediate notification for streak milestones.
   * Called when a user reaches a significant streak number.
   *
   * @param streakCount - The milestone streak count achieved
   */
  async showStreakMilestoneNotification(streakCount: number): Promise<void> {
    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission) {
        return;
      }

      const channelId = await this.createNotificationChannel();

      // Define milestone messages based on streak count
      let title = '';
      let body = '';

      if (streakCount === 7) {
        title = '🎉 One Week Streak!';
        body = 'Amazing! You\'ve completed 7 days in a row. Keep the momentum going!';
      } else if (streakCount === 14) {
        title = '⭐ Two Week Streak!';
        body = 'Incredible consistency! 14 days of soul-boosting reflections.';
      } else if (streakCount === 30) {
        title = '🔥 One Month Streak!';
        body = 'A whole month of daily reflections! You\'re building a powerful habit.';
      } else if (streakCount === 100) {
        title = '🏆 100 Day Streak!';
        body = 'Legendary! 100 days of consistent self-reflection. You\'re truly inspiring!';
      } else if (streakCount === 365) {
        title = '👑 One Year Streak!';
        body = 'Unbelievable dedication! A full year of daily soul-boosting. You\'re a champion!';
      } else {
        // Don't show notification for non-milestone streaks
        return;
      }

      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          importance: AndroidImportance.HIGH,
        },
      });
    } catch (error) {
      console.error('Error showing streak milestone notification:', error);
    }
  },

  /**
   * Schedules an evening reminder notification to maintain the streak.
   * Sent at 8 PM if the user hasn't completed their daily tasks.
   *
   * @param streakInfo - Current streak information
   */
  async scheduleStreakReminderNotification(streakInfo: StreakInfo): Promise<void> {
    try {
      const hasPermission = await this.checkPermission();
      if (!hasPermission || streakInfo.isTodayComplete) {
        return;
      }

      // Only remind if there's a streak at risk
      if (!streakInfo.isStreakAtRisk || streakInfo.currentStreak === 0) {
        return;
      }

      const channelId = await this.createNotificationChannel();

      // Create a trigger for 8:00 PM today
      const trigger: any = {
        type: TriggerType.TIMESTAMP,
        timestamp: this.getNext8PMTimestamp(),
      };

      await notifee.createTriggerNotification(
        {
          id: 'streak-reminder',
          title: `⏰ Don't lose your ${streakInfo.currentStreak}-day streak!`,
          body: 'Complete your daily reflections before midnight to keep your streak alive.',
          android: {
            channelId,
            smallIcon: 'ic_launcher',
            importance: AndroidImportance.HIGH,
          },
        },
        trigger
      );

      console.log('Streak reminder scheduled for 8:00 PM');
    } catch (error) {
      console.error('Error scheduling streak reminder:', error);
    }
  },

  /**
   * Gets the timestamp for 8 PM today (or tomorrow if already past 8 PM).
   *
   * @returns Timestamp in milliseconds for next 8 PM
   */
  getNext8PMTimestamp(): number {
    const now = new Date();
    const next8PM = new Date();
    next8PM.setHours(20, 0, 0, 0);

    // If 8 PM has already passed today, schedule for tomorrow
    if (now.getTime() >= next8PM.getTime()) {
      next8PM.setDate(next8PM.getDate() + 1);
    }

    return next8PM.getTime();
  },

  /**
   * Cancels the streak reminder notification.
   * Called when the user completes their daily tasks.
   */
  async cancelStreakReminder(): Promise<void> {
    try {
      await notifee.cancelNotification('streak-reminder');
    } catch (error) {
      console.error('Error canceling streak reminder:', error);
    }
  },
};
