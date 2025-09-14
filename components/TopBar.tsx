// skillforge/components/TopBar.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import CoursesDropdown from './CoursesDropdown';
import { useRouter } from 'expo-router';

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
                                   enrolledCourses = [],
                               }: TopBarProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Left: Streak */}
            <Pressable style={styles.streakBox} onPress={() => router.push('/profile')}>
                <Text style={styles.streakLabel}>🔥 Streak</Text>
                <Text style={styles.streakValue}>{currentStreak}</Text>
            </Pressable>

            {/* Center: Course Dropdown */}
            <CoursesDropdown
                trigger={
                    <View style={styles.courseBox}>
                        <Text style={styles.courseText}>selectedCourse ▼</Text>
                    </View>
                }
                enrolledCourses={enrolledCourses}
            />

            {/* Right: Currency / Hearts */}
            <View style={styles.rightBox}>
                <View style={styles.currencyBox}>
                    <Text style={styles.currencyText}>💰 {currency}</Text>
                </View>
                {hearts > 0 && (
                    <View style={styles.heartsBox}>
                        <Text style={styles.heartsText}>❤️ {hearts}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#1a1b1f',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    streakBox: {
        alignItems: 'center',
    },
    streakLabel: { color: '#fff', fontSize: 12 },
    streakValue: { color: '#fff', fontWeight: '700', fontSize: 16 },
    courseBox: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    courseText: { color: '#fff', fontWeight: '600' },
    rightBox: { flexDirection: 'row', alignItems: 'center' },
    currencyBox: { marginRight: 10 },
    currencyText: { color: '#fff', fontWeight: '600' },
    heartsBox: {},
    heartsText: { color: '#fff', fontWeight: '600' },
});
