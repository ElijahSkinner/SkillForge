// services/NotificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true, // Will respect user's soundEnabled setting
        shouldSetBadge: false,
    }),
});

export class NotificationService {
    private static instance: NotificationService;
    private notificationPermission: Notifications.NotificationPermissionsStatus | null = null;

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Request notification permissions
    async requestPermissions(): Promise<boolean> {
        if (!Device.isDevice) {
            console.log('Notifications not supported on simulator/emulator');
            return false;
        }

        // Check current permissions
        let permission = await Notifications.getPermissionsAsync();

        if (!permission.granted) {
            // Request permissions if not granted
            permission = await Notifications.requestPermissionsAsync({
                ios: {
                    allowAlert: true,
                    allowBadge: true,
                    allowSound: true,
                    allowAnnouncements: false,
                },
            });
        }

        this.notificationPermission = permission;
        return permission.granted;
    }

    // Check if notifications are enabled (both permission and user setting)
    async areNotificationsEnabled(userNotificationsEnabled: boolean): Promise<boolean> {
        if (!userNotificationsEnabled) {
            return false;
        }

        const permission = await Notifications.getPermissionsAsync();
        return permission.granted;
    }

    // Schedule daily study reminder
    async scheduleStudyReminder(
        time: string, // Format: "HH:MM"
        notificationsEnabled: boolean,
        soundEnabled: boolean = true
    ): Promise<boolean> {
        try {
            // Cancel existing reminder first
            await this.cancelStudyReminder();

            if (!notificationsEnabled) {
                console.log('Notifications disabled by user');
                return false;
            }

            // Request permissions
            const hasPermission = await this.requestPermissions();
            if (!hasPermission) {
                console.log('Notification permission denied');
                return false;
            }

            // Parse time
            const [hour, minute] = time.split(':').map(Number);
            if (isNaN(hour) || isNaN(minute)) {
                throw new Error('Invalid time format');
            }

            // Schedule the notification
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Time to forge your skills! 🔥",
                    body: "Ready to earn some XP? Let's continue your learning journey.",
                    data: {
                        type: 'study_reminder',
                        timestamp: new Date().toISOString()
                    },
                    sound: soundEnabled ? 'default' : false,
                },
                trigger: {
                    hour,
                    minute,
                    repeats: true, // Daily repetition
                },
            });

            console.log('Study reminder scheduled:', notificationId);
            return true;

        } catch (error) {
            console.error('Failed to schedule study reminder:', error);
            return false;
        }
    }

    // Cancel the study reminder
    async cancelStudyReminder(): Promise<void> {
        try {
            // Get all scheduled notifications
            const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

            // Find and cancel study reminder notifications
            for (const notification of scheduledNotifications) {
                if (notification.content.data?.type === 'study_reminder') {
                    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
                    console.log('Cancelled study reminder:', notification.identifier);
                }
            }
        } catch (error) {
            console.error('Failed to cancel study reminder:', error);
        }
    }

    // Schedule achievement notification (for when user completes lessons)
    async scheduleAchievementNotification(
        title: string,
        body: string,
        delay: number = 0, // seconds
        soundEnabled: boolean = true
    ): Promise<boolean> {
        try {
            const hasPermission = await Notifications.getPermissionsAsync();
            if (!hasPermission.granted) {
                return false;
            }

            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    data: { type: 'achievement' },
                    sound: soundEnabled ? 'default' : false,
                },
                trigger: delay > 0 ? { seconds: delay } : null,
            });

            return true;
        } catch (error) {
            console.error('Failed to schedule achievement notification:', error);
            return false;
        }
    }

    // Handle notification response (when user taps notification)
    addNotificationResponseListener(callback: (response: Notifications.NotificationResponse) => void) {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }

    // Get notification permission status
    async getPermissionStatus(): Promise<Notifications.NotificationPermissionsStatus> {
        return await Notifications.getPermissionsAsync();
    }

    // Check if device supports notifications
    isDeviceSupported(): boolean {
        return Device.isDevice && Platform.OS !== 'web';
    }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();