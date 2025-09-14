import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CoursesDropdown from '@/components/CoursesDropdown';
import { useRouter } from 'expo-router';

type Course = { id: number; name: string; score?: number };

type TopBarProps = {
    currentStreak: number;
    currency: number;
    hearts?: number;
    selectedCourse?: Course | null;
    enrolledCourses?: Course[];
    onSelectCourse?: (course: Course) => void;
};

export default function TopBar({
                                   currentStreak,
                                   currency,
                                   hearts = 0,
                                   selectedCourse,
                                   enrolledCourses = [],
                                   onSelectCourse,
                               }: TopBarProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Left: Streak */}
            <Text style={styles.streakLabel}>🔥 Streak {currentStreak}</Text>

            {/* Center: Course Dropdown */}
            <CoursesDropdown
                trigger={
                    <View style={styles.courseBox}>
                        <Text style={styles.courseText}>
                            {selectedCourse ? selectedCourse.name : 'Select a course'} ▼
                        </Text>
                    </View>
                }
                enrolledCourses={enrolledCourses}
                onSelectCourse={onSelectCourse} // pass handler
            />

            {/* Right: Currency */}
            <Text style={styles.currencyText}>💰 {currency}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, backgroundColor: '#1a1b1f', alignItems: 'center' },
    streakLabel: { color: '#fff', fontWeight: '600' },
    courseBox: { padding: 8, backgroundColor: '#333', borderRadius: 8 },
    courseText: { color: '#fff', fontWeight: '600' },
    currencyText: { color: '#fff', fontWeight: '600' },
});
