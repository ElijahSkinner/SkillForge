// services/NotificationService.ts
// Mock implementation for Expo Go development
import { Platform } from 'react-native';

export class NotificationService {
    private static instance: NotificationService;

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Mock permission request
    async requestPermissions(): Promise<boolean> {
        console.log('Mock: Notification permissions requested');
        return true; // Always grant in mock
    }

    // Mock notification check
    async areNotificationsEnabled(userNotificationsEnabled: boolean): Promise<boolean> {
        return userNotificationsEnabled;
    }

    // Mock schedule reminder
    async scheduleStudyReminder(
        time: string,
        notificationsEnabled: boolean,
        soundEnabled: boolean = true
    ): Promise<boolean> {
        if (!notificationsEnabled) {
            console.log('Mock: Notifications disabled by user');
            return false;
        }

        console.log(`Mock: Study reminder scheduled for ${time} (sound: ${soundEnabled})`);
        return true;
    }

    // Mock cancel reminder
    async cancelStudyReminder(): Promise<void> {
        console.log('Mock: Study reminder cancelled');
    }

    // Mock achievement notification
    async scheduleAchievementNotification(
        title: string,
        body: string,
        delay: number = 0,
        soundEnabled: boolean = true
    ): Promise<boolean> {
        console.log(`Mock: Achievement notification - ${title}: ${body}`);
        return true;
    }

    // Mock listener
    addNotificationResponseListener(callback: (response: any) => void) {
        console.log('Mock: Notification response listener added');
        return { remove: () => console.log('Mock: Listener removed') };
    }

    // Mock permission status
    async getPermissionStatus(): Promise<any> {
        return { granted: true };
    }

    // Check if device supports notifications
    isDeviceSupported(): boolean {
        return Platform.OS !== 'web';
    }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// For production builds, you would use the real implementation:
/*
// Uncomment this section when building for production

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export class NotificationService {
  // ... real implementation here
}
*/