// components/TopBar.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import CoursesDropdown from './CoursesDropdown';
import StreakDisplay from './StreakDisplay';

type TopBarProps = {
    currentStreak: number;
    currency: number;
    hearts?: number;
    selectedCourse?: { id: number; name: string } | null;
    enrolledCourses?: { id: number; name: string; score: number }[];
};

export default function TopBar({
                                   currentStreak,
                                   currency,
                                   hearts = 0,
                                   selectedCourse = null,
                                   enrolledCourses = [],
                               }: TopBarProps) {
    const router = useRouter();
    const { theme } = useTheme();

    return (
        <View style={{
            flexDirection: 'row',
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: theme.spacing.lg, // Extra padding for status bar area
        }}>
            {/* Left: Streak with new component */}
            <Pressable onPress={() => router.push('/profile')}>
                <StreakDisplay size="small" />
            </Pressable>

            {/* Center: Course Dropdown */}
            <CoursesDropdown
                trigger={
                    <View style={{
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.sm,
                        borderRadius: theme.borderRadius.md,
                        backgroundColor: theme.colors.primary + '20',
                        borderWidth: 1,
                        borderColor: theme.colors.primary + '40',
                    }}>
                        <Text style={{
                            color: theme.colors.primary,
                            fontWeight: '600',
                            fontSize: 16,
                        }}>
                            {selectedCourse ? selectedCourse.name : 'Select Course'} ▼
                        </Text>
                    </View>
                }
                enrolledCourses={enrolledCourses}
            />

            {/* Right: XP and Hearts */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* XP Display */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: theme.colors.success + '20',
                    paddingHorizontal: theme.spacing.sm,
                    paddingVertical: theme.spacing.xs,
                    borderRadius: theme.borderRadius.md,
                    marginRight: hearts > 0 ? theme.spacing.sm : 0,
                }}>
                    <Ionicons
                        name="flash"
                        size={16}
                        color={theme.colors.success}
                        style={{ marginRight: 4 }}
                    />
                    <Text style={{
                        color: theme.colors.success,
                        fontWeight: '700',
                        fontSize: 14,
                    }}>
                        {currency}
                    </Text>
                </View>

                {/* Hearts Display (if needed) */}
                {hearts > 0 && (
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: theme.colors.error + '20',
                        paddingHorizontal: theme.spacing.sm,
                        paddingVertical: theme.spacing.xs,
                        borderRadius: theme.borderRadius.md,
                    }}>
                        <Ionicons
                            name="heart"
                            size={16}
                            color={theme.colors.error}
                            style={{ marginRight: 4 }}
                        />
                        <Text style={{
                            color: theme.colors.error,
                            fontWeight: '700',
                            fontSize: 14,
                        }}>
                            {hearts}
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}