// components/StreakDisplay.tsx
import React, { useEffect, useState } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ThemedText, ThemedView } from '@/components/themed';
import { backgroundStreakService } from '@/services/BackgroundStreakService';

interface StreakDisplayProps {
    size?: 'small' | 'medium' | 'large';
    onPress?: () => void;
    showMessage?: boolean;
}

export default function StreakDisplay({
                                          size = 'medium',
                                          onPress,
                                          showMessage = false
                                      }: StreakDisplayProps) {
    const { theme } = useTheme();
    const { progress } = useAuth();
    const [streakStats, setStreakStats] = useState<any>(null);

    // Update streak stats periodically
    useEffect(() => {
        const updateStats = () => {
            const stats = backgroundStreakService.getStreakStats();
            setStreakStats(stats);
        };

        updateStats();

        // Update every minute to keep UI fresh
        const interval = setInterval(updateStats, 60000);

        return () => clearInterval(interval);
    }, [progress]);

    if (!streakStats) {
        return null;
    }

    const { currentStreak, hasStudiedToday, isAtRisk } = streakStats;

    // Size configurations
    const sizeConfig = {
        small: { iconSize: 16, textSize: 'caption' as const, containerPadding: 8 },
        medium: { iconSize: 20, textSize: 'body1' as const, containerPadding: 12 },
        large: { iconSize: 24, textSize: 'h4' as const, containerPadding: 16 },
    };

    const config = sizeConfig[size];

    // Determine streak status and styling
    const getStreakStatus = () => {
        if (currentStreak === 0) {
            return {
                color: theme.colors.textMuted,
                icon: 'flame-outline' as const,
                message: 'Start your streak!'
            };
        } else if (hasStudiedToday) {
            return {
                color: theme.colors.success,
                icon: 'flame' as const,
                message: `Great job! ${currentStreak} day streak!`
            };
        } else if (isAtRisk) {
            return {
                color: theme.colors.warning,
                icon: 'flame-outline' as const,
                message: `Don't lose your ${currentStreak} day streak!`
            };
        } else {
            return {
                color: theme.colors.primary,
                icon: 'flame' as const,
                message: `${currentStreak} day streak - keep it going!`
            };
        }
    };

    const status = getStreakStatus();

    const StreakContent = () => (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: status.color + '20',
            paddingHorizontal: config.containerPadding,
            paddingVertical: config.containerPadding / 2,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: status.color + '40',
        }}>
            <Ionicons
                name={status.icon}
                size={config.iconSize}
                color={status.color}
                style={{ marginRight: theme.spacing.xs }}
            />
            <ThemedText
                variant={config.textSize}
                style={{
                    color: status.color,
                    fontWeight: '600'
                }}
            >
                {currentStreak === 0 ? '0' : currentStreak}
            </ThemedText>
            {showMessage && (
                <ThemedText
                    variant="caption"
                    color="textSecondary"
                    style={{ marginLeft: theme.spacing.sm }}
                >
                    {status.message}
                </ThemedText>
            )}
        </View>
    );

    if (onPress) {
        return (
            <Pressable onPress={onPress}>
                <StreakContent />
            </Pressable>
        );
    }

    return <StreakContent />;
}

// Detailed streak modal/screen component
export function StreakDetails() {
    const { theme } = useTheme();
    const { progress } = useAuth();
    const [streakStats, setStreakStats] = useState<any>(null);
    const [streakMessage, setStreakMessage] = useState<string>('');

    useEffect(() => {
        const updateData = () => {
            const stats = backgroundStreakService.getStreakStats();
            const message = backgroundStreakService.getStreakMessage();
            setStreakStats(stats);
            setStreakMessage(message);
        };

        updateData();
        const interval = setInterval(updateData, 60000);
        return () => clearInterval(interval);
    }, [progress]);

    if (!streakStats) {
        return (
            <ThemedView variant="card" style={{ padding: theme.spacing.lg }}>
                <ThemedText variant="body1">Loading streak data...</ThemedText>
            </ThemedView>
        );
    }

    const { currentStreak, maxStreakAllTime, hasStudiedToday, isAtRisk } = streakStats;

    return (
        <ThemedView variant="card" style={{
            padding: theme.spacing.lg,
            margin: theme.spacing.md,
            borderRadius: theme.borderRadius.lg
        }}>
            {/* Main Streak Display */}
            <View style={{ alignItems: 'center', marginBottom: theme.spacing.lg }}>
                <Ionicons
                    name={currentStreak > 0 ? 'flame' : 'flame-outline'}
                    size={48}
                    color={currentStreak > 0 ? theme.colors.primary : theme.colors.textMuted}
                    style={{ marginBottom: theme.spacing.sm }}
                />
                <ThemedText variant="h1" color="primary">
                    {currentStreak}
                </ThemedText>
                <ThemedText variant="h4" color="textSecondary">
                    Day{currentStreak !== 1 ? 's' : ''} in a row
                </ThemedText>
            </View>

            {/* Status Message */}
            <ThemedText
                variant="body1"
                style={{
                    textAlign: 'center',
                    marginBottom: theme.spacing.lg,
                    color: isAtRisk ? theme.colors.warning : theme.colors.text
                }}
            >
                {streakMessage}
            </ThemedText>

            {/* Stats Grid */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: theme.spacing.lg
            }}></View>
                {/* Stats Grid */}
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: theme.spacing.lg
                }}>
                    <View style={{ alignItems: 'center' }}>
                        <ThemedText variant="h3" color="primary">
                            {maxStreakAllTime}
                        </ThemedText>
                        <ThemedText variant="caption" color="textSecondary">
                            Best Streak
                        </ThemedText>
                    </View>

                    <View style={{ alignItems: 'center' }}>
                        <Ionicons
                            name={hasStudiedToday ? 'checkmark-circle' : 'ellipse-outline'}
                            size={24}
                            color={hasStudiedToday ? theme.colors.success : theme.colors.textMuted}
                        />
                        <ThemedText variant="caption" color="textSecondary">
                            Today
                        </ThemedText>
                    </View>
                </View>

                {/* Tips */}
                <View style={{
                    backgroundColor: theme.colors.primary + '10',
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    borderLeftWidth: 4,
                    borderLeftColor: theme.colors.primary,
                }}>
                    <ThemedText variant="body2" color="textSecondary">
                        💡 Tip: Complete any lesson to maintain your streak. Even a quick 5-minute study session counts!
                    </ThemedText>
                </View>
        </ThemedView>
    );
}