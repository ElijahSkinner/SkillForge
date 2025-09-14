import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import TopBar from '@/components/TopBar';
import { CERTS_ROADMAP } from '../../../constants/certs';
import { useCert } from '@/context/CertContext';
import QuizRoadmap from '@/components/QuizRoadmap';

export default function CourseScreen() {
    const { selectedCert } = useCert();

    // Example data — replace with your real enrolled courses
    const [enrolledCourses] = useState([
        { id: 1, name: 'CompTIA A+ Core 1', score: 72 },
        { id: 2, name: 'CompTIA A+ Core 2', score: 65 },
        { id: 3, name: 'CompTIA Network+', score: 80 },
    ]);

    // Example streak/currency data
    const currentStreak = 5;
    const currency = 120;

    if (!selectedCert)
        return (
            <View style={styles.centered}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Select a cert first</Text>
            </View>
        );

    return (
        <View style={styles.container}>
            {/* Top bar with dropdown */}
            <TopBar currentStreak={currentStreak} currency={currency} hearts={3} />

            {/* Roadmap content behind dropdown */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <QuizRoadmap />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121214' },
    scrollContainer: { paddingVertical: 20 },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});