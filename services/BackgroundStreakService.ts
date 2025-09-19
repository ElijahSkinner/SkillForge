// services/BackgroundStreakService.ts
import { AppState, AppStateStatus } from 'react-native';
import { streakService } from './StreakService';

export class BackgroundStreakService {
    private static instance: BackgroundStreakService;
    private appStateSubscription: any = null;
    private streakCheckInterval: any = null; // Changed from NodeJS.Timeout
    private getUserProgress: (() => any) | null = null;
    private isInitialized = false;

    static getInstance(): BackgroundStreakService {
        if (!BackgroundStreakService.instance) {
            BackgroundStreakService.instance = new BackgroundStreakService();
        }
        return BackgroundStreakService.instance;
    }

    // Initialize the background service
    initialize(getUserProgress: () => any) {
        if (this.isInitialized) {
            return;
        }

        this.getUserProgress = getUserProgress;
        this.setupAppStateListener();
        this.setupPeriodicStreakCheck();
        this.isInitialized = true;

        console.log('BackgroundStreakService initialized');
    }

    // Set up app state change listener
    private setupAppStateListener() {
        this.appStateSubscription = AppState.addEventListener(
            'change',
            this.handleAppStateChange.bind(this)
        );
    }

    // Handle app state changes (foreground/background)
    private async handleAppStateChange(nextAppState: AppStateStatus) {
        if (nextAppState === 'active') {
            // App came to foreground - check streak status
            await this.performStreakCheck();
        } else if (nextAppState === 'background') {
            // App went to background - schedule streak warnings if needed
            await this.scheduleStreakWarnings();
        }
    }

    // Set up periodic streak checking (every hour when app is active)
    private setupPeriodicStreakCheck() {
        // Check every hour
        this.streakCheckInterval = setInterval(async () => {
            if (AppState.currentState === 'active') {
                await this.performStreakCheck();
            }
        }, 60 * 60 * 1000); // 1 hour
    }

    // Perform streak check and update
    private async performStreakCheck() {
        try {
            if (!this.getUserProgress) {
                return;
            }

            const progress = this.getUserProgress();
            if (!progress) {
                return;
            }

            // Update streak based on current status
            const result = await streakService.updateStreak(progress);

            if (result.streakBroken) {
                // Notify user about broken streak (but don't be harsh about it)
                console.log('Streak was broken, but that\'s okay! Every expert was once a beginner.');
            }

            // Check if user is at risk of losing current streak
            const notificationsEnabled = progress.notificationsEnabled ?? true;
            const soundEnabled = progress.soundEnabled ?? true;

            await streakService.checkStreakStatus(progress, notificationsEnabled, soundEnabled);

        } catch (error) {
            console.error('Error during streak check:', error);
        }
    }

    // Schedule streak warning notifications when app goes to background
    private async scheduleStreakWarnings() {
        try {
            if (!this.getUserProgress) {
                return;
            }

            const progress = this.getUserProgress();
            if (!progress) {
                return;
            }

            const notificationsEnabled = progress.notificationsEnabled ?? true;
            const soundEnabled = progress.soundEnabled ?? true;
            const currentStreak = progress.currentStreak || 0;

            if (currentStreak > 0 && notificationsEnabled) {
                // Schedule warning for later today if they haven't studied
                await streakService.scheduleStreakWarningNotification(
                    currentStreak,
                    notificationsEnabled,
                    soundEnabled
                );
            }
        } catch (error) {
            console.error('Error scheduling streak warnings:', error);
        }
    }

    // Manually trigger streak check (call this when user completes lessons)
    async onUserActivity() {
        try {
            if (!this.getUserProgress) {
                return { currentStreak: 0, streakIncremented: false };
            }

            const progress = this.getUserProgress();
            if (!progress) {
                return { currentStreak: 0, streakIncremented: false };
            }

            // Record study activity and potentially increment streak
            const result = await streakService.recordStudyActivity(progress);

            if (result.streakIncremented) {
                console.log(`Streak incremented to ${result.currentStreak} days!`);
            }

            return result;
        } catch (error) {
            console.error('Error recording user activity:', error);
            return { currentStreak: 0, streakIncremented: false };
        }
    }

    // Get current streak statistics
    getStreakStats() {
        if (!this.getUserProgress) {
            return null;
        }

        const progress = this.getUserProgress();
        if (!progress) {
            return null;
        }

        return streakService.getStreakStats(progress);
    }

    // Get streak message for UI
    getStreakMessage() {
        if (!this.getUserProgress) {
            return "Start your learning journey today!";
        }

        const progress = this.getUserProgress();
        if (!progress) {
            return "Start your learning journey today!";
        }

        return streakService.getStreakMessage(progress);
    }

    // Clean up when app is closed
    cleanup() {
        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }

        if (this.streakCheckInterval) {
            clearInterval(this.streakCheckInterval);
            this.streakCheckInterval = null;
        }

        this.isInitialized = false;
        console.log('BackgroundStreakService cleaned up');
    }
}

// Export singleton
export const backgroundStreakService = BackgroundStreakService.getInstance();