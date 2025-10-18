// app/(tabs)/today/index.tsx - UPDATED WITH REAL DATA
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '../../../context/AuthContext';
import { useCert } from '../../../context/CertContext';
import { useTheme } from '../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function TodayReviewScreen() {
    const router = useRouter();
    const { progress } = useAuth();
    const { selectedCert } = useCert();
    const { theme } = useTheme();

    const [todayStats, setTodayStats] = useState({
        lessonsCompleted: 0,
        xpEarned: 0,
        quizzesCompleted: 0,
        studyTime: 0
    });

    useEffect(() => {
        calculateTodayStats();
    }, [progress]);

    const calculateTodayStats = () => {
        if (!progress) return;

        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const lastActive = progress.lastActiveDate ? new Date(progress.lastActiveDate) : null;

        // Check if user was active today
        const wasActiveToday = lastActive &&
            lastActive.getFullYear() === todayStart.getFullYear() &&
            lastActive.getMonth() === todayStart.getMonth() &&
            lastActive.getDate() === todayStart.getDate();

        if (wasActiveToday) {
            // For demo purposes, show some stats if active today
            // In production, you'd want to track daily stats separately
            setTodayStats({
                lessonsCompleted: Math.min(progress.completedLessons?.length || 0, 5),
                xpEarned: progress.weeklyXP || 0,
                quizzesCompleted: progress.completedQuizzes?.length || 0,
                studyTime: Math.min(progress.studyTimeMinutes || 0, 60)
            });
        }
    };

    // Get recent mistakes from review queue
    const recentMistakes = progress?.mistakesReview?.slice(0, 3) || [];

    // Get recently learned topics from completed lessons
    const getRecentlyLearned = () => {
        const completed = progress?.completedLessons || [];
        return completed.slice(-5).map(lessonKey => {
            const parts = lessonKey.split('_');
            return {
                id: lessonKey,
                module: `Module ${parts[1]}`,
                lesson: `Lesson ${parts[2]}`
            };
        });
    };

    const recentlyLearned = getRecentlyLearned();

    // Check if user has studied today
    const hasStudiedToday = () => {
        if (!progress?.lastActiveDate) return false;
        const today = new Date();
        const lastActive = new Date(progress.lastActiveDate);
        return today.toDateString() === lastActive.toDateString();
    };

    const studiedToday = hasStudiedToday();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView style={styles.container} contentContainerStyle={{ padding: theme.spacing.lg }}>
                {/* Header */}
                <View style={{ marginBottom: theme.spacing.lg }}>
                    <Text style={[theme.typography.h2, { color: theme.colors.text, marginBottom: theme.spacing.xs }]}>
                        Today's Review
                    </Text>
                    <Text style={[theme.typography.body2, { color: theme.colors.textSecondary }]}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </Text>
                </View>

                {/* Today's Stats */}
                <View style={[styles.statsContainer, {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.md,
                    padding: theme.spacing.md,
                    marginBottom: theme.spacing.lg,
                    ...theme.shadows.small
                }]}>
                    <Text style={[theme.typography.h4, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
                        Today's Progress
                    </Text>

                    <View style={styles.statsGrid}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: theme.colors.primary + '20' }]}>
                                <Ionicons name="book" size={24} color={theme.colors.primary} />
                            </View>
                            <Text style={[theme.typography.h3, { color: theme.colors.text }]}>
                                {studiedToday ? todayStats.lessonsCompleted : 0}
                            </Text>
                            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                                Lessons
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: theme.colors.success + '20' }]}>
                                <Ionicons name="flash" size={24} color={theme.colors.success} />
                            </View>
                            <Text style={[theme.typography.h3, { color: theme.colors.text }]}>
                                {studiedToday ? todayStats.xpEarned : 0}
                            </Text>
                            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                                XP Earned
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: theme.colors.warning + '20' }]}>
                                <Ionicons name="checkmark-circle" size={24} color={theme.colors.warning} />
                            </View>
                            <Text style={[theme.typography.h3, { color: theme.colors.text }]}>
                                {studiedToday ? todayStats.quizzesCompleted : 0}
                            </Text>
                            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                                Quizzes
                            </Text>
                        </View>

                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: theme.colors.info + '20' }]}>
                                <Ionicons name="time" size={24} color={theme.colors.info} />
                            </View>
                            <Text style={[theme.typography.h3, { color: theme.colors.text }]}>
                                {studiedToday ? todayStats.studyTime : 0}
                            </Text>
                            <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                                Minutes
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={[styles.section, { marginBottom: theme.spacing.lg }]}>
                    <Text style={[theme.typography.h4, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
                        Quick Actions
                    </Text>

                    <Pressable
                        style={[styles.actionButton, {
                            backgroundColor: theme.colors.primary,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.sm,
                            ...theme.shadows.small
                        }]}
                        onPress={() => router.push('/(tabs)/roadmap')}
                    >
                        <Ionicons name="play-circle" size={24} color={theme.colors.textOnPrimary} />
                        <Text style={[theme.typography.button, { color: theme.colors.textOnPrimary, marginLeft: theme.spacing.sm }]}>
                            Continue Learning
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[styles.actionButton, {
                            backgroundColor: theme.colors.secondary,
                            borderRadius: theme.borderRadius.md,
                            ...theme.shadows.small
                        }]}
                        onPress={() => router.push('/(tabs)/glossary')}
                        disabled={recentMistakes.length === 0}
                    >
                        <Ionicons name="refresh-circle" size={24} color={theme.colors.text} />
                        <Text style={[theme.typography.button, { color: theme.colors.text, marginLeft: theme.spacing.sm }]}>
                            Review Flashcards
                        </Text>
                    </Pressable>
                </View>

                {/* Recent Mistakes Section */}
                {recentMistakes.length > 0 && (
                    <View style={[styles.section, { marginBottom: theme.spacing.lg }]}>
                        <Text style={[theme.typography.h4, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
                            Topics to Review
                        </Text>
                        {recentMistakes.map((mistake, idx) => (
                            <View
                                key={idx}
                                style={[styles.itemCard, {
                                    backgroundColor: theme.colors.surface,
                                    borderRadius: theme.borderRadius.md,
                                    borderLeftWidth: 4,
                                    borderLeftColor: theme.colors.warning,
                                    marginBottom: theme.spacing.sm,
                                    padding: theme.spacing.md
                                }]}
                            >
                                <Text style={[theme.typography.body1, { color: theme.colors.text, fontWeight: '600' }]}>
                                    {mistake.topic || 'Review Topic'}
                                </Text>
                                <Text style={[theme.typography.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing.xs }]}>
                                    {mistake.module || 'General Review'}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Recently Learned */}
                {recentlyLearned.length > 0 && (
                    <View style={styles.section}>
                        <Text style={[theme.typography.h4, { color: theme.colors.text, marginBottom: theme.spacing.md }]}>
                            Recently Learned
                        </Text>
                        {recentlyLearned.map((item) => (
                            <View
                                key={item.id}
                                style={[styles.itemCard, {
                                    backgroundColor: theme.colors.surface,
                                    borderRadius: theme.borderRadius.md,
                                    borderLeftWidth: 4,
                                    borderLeftColor: theme.colors.success,
                                    marginBottom: theme.spacing.sm,
                                    padding: theme.spacing.md
                                }]}
                            >
                                <View style={styles.itemContent}>
                                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                                    <View style={{ marginLeft: theme.spacing.sm, flex: 1 }}>
                                        <Text style={[theme.typography.body1, { color: theme.colors.text, fontWeight: '600' }]}>
                                            {item.lesson}
                                        </Text>
                                        <Text style={[theme.typography.caption, { color: theme.colors.textSecondary }]}>
                                            {item.module}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Empty State */}
                {!studiedToday && recentlyLearned.length === 0 && (
                    <View style={[styles.emptyState, {
                        padding: theme.spacing.xl,
                        alignItems: 'center'
                    }]}>
                        <Ionicons name="rocket-outline" size={64} color={theme.colors.textMuted} />
                        <Text style={[theme.typography.h3, {
                            color: theme.colors.text,
                            marginTop: theme.spacing.md,
                            textAlign: 'center'
                        }]}>
                            Start Your Day Right!
                        </Text>
                        <Text style={[theme.typography.body2, {
                            color: theme.colors.textSecondary,
                            marginTop: theme.spacing.sm,
                            textAlign: 'center'
                        }]}>
                            Complete a lesson to track your progress here
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    statsContainer: {},
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'space-between'
    },
    statItem: {
        alignItems: 'center',
        width: '48%',
        padding: 12
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8
    },
    section: {},
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'center'
    },
    itemCard: {},
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    emptyState: {}
});