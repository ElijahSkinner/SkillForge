// services/StreakService.ts
import { notificationService } from './NotificationService';

interface StreakData {
    currentStreak: number;
    maxStreakAllTime: number;
    lastActiveDate: string; // ISO date string
    streakResetWarningShown?: boolean;
}

export class StreakService {
    private static instance: StreakService;
    private updateProgressField: (field: string, value: any) => Promise<void>;

    static getInstance(): StreakService {
        if (!StreakService.instance) {
            StreakService.instance = new StreakService();
        }
        return StreakService.instance;
    }

    // Initialize with updateProgressField function from AuthContext
    initialize(updateProgressField: (field: string, value: any) => Promise<void>) {
        this.updateProgressField = updateProgressField;
    }

    // Check if user studied today (has any activity today)
    private hasStudiedToday(lastActiveDate: string): boolean {
        if (!lastActiveDate) return false;

        const today = new Date();
        const lastActive = new Date(lastActiveDate);

        // Reset time to start of day for comparison
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastActiveStart = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

        return todayStart.getTime() === lastActiveStart.getTime();
    }

    // Check if streak should be broken (missed yesterday)
    private shouldBreakStreak(lastActiveDate: string): boolean {
        if (!lastActiveDate) return true;

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const lastActive = new Date(lastActiveDate);

        // Reset times for day-only comparison
        const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const lastActiveStart = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());

        // If last active was before yesterday, break streak
        return lastActiveStart.getTime() < yesterdayStart.getTime();
    }

    // Check if user is at risk of losing streak (hasn't studied today and it's evening)
    private isStreakAtRisk(lastActiveDate: string): boolean {
        if (!lastActiveDate) return false;

        const now = new Date();
        const currentHour = now.getHours();

        // Consider streak at risk if it's after 6 PM and haven't studied today
        const isEvening = currentHour >= 18;
        const hasStudiedToday = this.hasStudiedToday(lastActiveDate);

        return isEvening && !hasStudiedToday;
    }

    // Calculate and update streak based on current activity
    async updateStreak(progress: any): Promise<{ currentStreak: number; maxStreakAllTime: number; streakBroken: boolean }> {
        if (!this.updateProgressField) {
            throw new Error('StreakService not initialized');
        }

        const lastActiveDate = progress?.lastActiveDate;
        const currentStreak = progress?.currentStreak || 0;
        const maxStreakAllTime = progress?.maxStreakAllTime || 0;

        let newCurrentStreak = currentStreak;
        let newMaxStreak = maxStreakAllTime;
        let streakBroken = false;

        if (this.shouldBreakStreak(lastActiveDate)) {
            // Streak should be broken
            if (currentStreak > 0) {
                newCurrentStreak = 0;
                streakBroken = true;
                console.log(`Streak broken! Was ${currentStreak} days.`);
            }
        } else if (this.hasStudiedToday(lastActiveDate)) {
            // User studied today - maintain or continue streak
            // Don't increment if already counted today
            console.log('Streak maintained - studied today');
        }

        // Update max streak if current is higher
        if (newCurrentStreak > newMaxStreak) {
            newMaxStreak = newCurrentStreak;
        }

        // Update database if values changed
        if (newCurrentStreak !== currentStreak || newMaxStreak !== maxStreakAllTime) {
            try {
                await this.updateProgressField('currentStreak', newCurrentStreak);
                if (newMaxStreak !== maxStreakAllTime) {
                    await this.updateProgressField('maxStreakAllTime', newMaxStreak);
                }
            } catch (error) {
                console.error('Failed to update streak:', error);
            }
        }

        return {
            currentStreak: newCurrentStreak,
            maxStreakAllTime: newMaxStreak,
            streakBroken
        };
    }

    // Record study activity and potentially increment streak
    async recordStudyActivity(progress: any): Promise<{ currentStreak: number; streakIncremented: boolean }> {
        if (!this.updateProgressField) {
            throw new Error('StreakService not initialized');
        }

        const now = new Date().toISOString();
        const lastActiveDate = progress?.lastActiveDate;
        const currentStreak = progress?.currentStreak || 0;
        const maxStreakAllTime = progress?.maxStreakAllTime || 0;

        let newCurrentStreak = currentStreak;
        let streakIncremented = false;

        // Update last active date
        await this.updateProgressField('lastActiveDate', now);

        if (!this.hasStudiedToday(lastActiveDate)) {
            // First study session today - increment streak
            if (this.shouldBreakStreak(lastActiveDate)) {
                // Streak was broken, start over
                newCurrentStreak = 1;
                console.log('Starting new streak!');
            } else {
                // Continue streak
                newCurrentStreak = currentStreak + 1;
                console.log(`Streak continued! Now ${newCurrentStreak} days.`);
            }

            streakIncremented = true;

            // Update streak in database
            await this.updateProgressField('currentStreak', newCurrentStreak);

            // Update max streak if needed
            if (newCurrentStreak > maxStreakAllTime) {
                await this.updateProgressField('maxStreakAllTime', newCurrentStreak);
            }

            // Cancel any pending streak warning notifications
            await this.cancelStreakWarningNotification();
        }

        return {
            currentStreak: newCurrentStreak,
            streakIncremented
        };
    }

    // Schedule streak warning notification for users at risk
    async scheduleStreakWarningNotification(currentStreak: number, notificationsEnabled: boolean = true, soundEnabled: boolean = true): Promise<void> {
        if (!notificationsEnabled || currentStreak === 0) {
            return;
        }

        try {
            // Schedule for 8 PM if they haven't studied
            const now = new Date();
            const warningTime = new Date();
            warningTime.setHours(20, 0, 0, 0); // 8:00 PM

            // If it's already past 8 PM, schedule for tomorrow
            if (now.getTime() > warningTime.getTime()) {
                warningTime.setDate(warningTime.getDate() + 1);
            }

            const secondsUntilWarning = Math.max(0, (warningTime.getTime() - now.getTime()) / 1000);

            await notificationService.scheduleAchievementNotification(
                `Don't lose your ${currentStreak}-day streak!`,
                `You're doing great! Complete a quick lesson to keep your streak alive.`,
                secondsUntilWarning,
                soundEnabled
            );

            console.log(`Streak warning scheduled for ${warningTime.toLocaleTimeString()}`);
        } catch (error) {
            console.error('Failed to schedule streak warning:', error);
        }
    }

    // Cancel streak warning notifications
    async cancelStreakWarningNotification(): Promise<void> {
        // This would need to be implemented in NotificationService
        // For now, just log
        console.log('Streak warning notification cancelled');
    }

    // Check streak status and handle warnings
    async checkStreakStatus(progress: any, notificationsEnabled: boolean = true, soundEnabled: boolean = true): Promise<void> {
        const lastActiveDate = progress?.lastActiveDate;
        const currentStreak = progress?.currentStreak || 0;

        if (currentStreak > 0 && this.isStreakAtRisk(lastActiveDate)) {
            // User has a streak but hasn't studied today and it's evening
            await this.scheduleStreakWarningNotification(currentStreak, notificationsEnabled, soundEnabled);
        }
    }

    // Get streak statistics
    getStreakStats(progress: any): {
        currentStreak: number;
        maxStreakAllTime: number;
        hasStudiedToday: boolean;
        isAtRisk: boolean;
        daysUntilRisk: number;
    } {
        const lastActiveDate = progress?.lastActiveDate;
        const currentStreak = progress?.currentStreak || 0;
        const maxStreakAllTime = progress?.maxStreakAllTime || 0;

        const hasStudiedToday = this.hasStudiedToday(lastActiveDate);
        const isAtRisk = this.isStreakAtRisk(lastActiveDate);

        // Calculate days until streak is at risk
        let daysUntilRisk = 0;
        if (!hasStudiedToday) {
            const now = new Date();
            const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
            daysUntilRisk = Math.ceil((endOfDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        } else {
            daysUntilRisk = 1; // Tomorrow
        }

        return {
            currentStreak,
            maxStreakAllTime,
            hasStudiedToday,
            isAtRisk,
            daysUntilRisk
        };
    }

    // Format streak for display
    formatStreakDisplay(streak: number): string {
        if (streak === 0) return 'No streak yet';
        if (streak === 1) return '1 day streak';
        return `${streak} day streak`;
    }

    // Get encouraging streak message
    getStreakMessage(progress: any): string {
        const stats = this.getStreakStats(progress);

        if (stats.currentStreak === 0) {
            return "Start your learning streak today!";
        } else if (stats.hasStudiedToday) {
            return `Great job! You've maintained your ${stats.currentStreak}-day streak.`;
        } else if (stats.isAtRisk) {
            return `Don't lose your ${stats.currentStreak}-day streak! Study today to keep it alive.`;
        } else {
            return `You're on a ${stats.currentStreak}-day streak! Keep it going.`;
        }
    }
}

// Export singleton instance