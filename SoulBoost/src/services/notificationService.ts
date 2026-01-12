import notifee, { 
  AndroidImportance, 
  AuthorizationStatus, 
  RepeatFrequency, 
  TriggerType 
} from '@notifee/react-native';
import { storage } from '../utils/storage';

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
};
