import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function ProfileScreen() {
    const router = useRouter();

    // Placeholder data for now
    const [streak, setStreak] = useState(5);
    const [totalXP, setTotalXP] = useState(1200);
    const [currentLeague, setCurrentLeague] = useState('Bronze');
    const [topCourseScore, setTopCourseScore] = useState({ cert: 'A+ Core 1', score: 95 });

    return (
        <SafeAreaView style={{ flex: 1, }}>

        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Profile</Text>
                <Pressable onPress={() => router.push('/settings')}>
                    <Ionicons name="settings-outline" size={28} color="#fff" />
                </Pressable>
            </View>

            {/* Overview Box */}
            <View style={styles.box}>
                <Text style={styles.boxTitle}>Overview</Text>
                <Text>Streak: {streak} 🔥</Text>
                <Text>Total XP: {totalXP}</Text>
                <Text>Current League: {currentLeague}</Text>
                <Text>Top Score: {topCourseScore.cert} - {topCourseScore.score}%</Text>
            </View>

            {/* Friends Box */}
            <View style={styles.box}>
                <Text style={styles.boxTitle}>Friends</Text>
                <Text>No friends added yet</Text>
            </View>

            {/* Monthly Badges */}
            <View style={styles.box}>
                <Text style={styles.boxTitle}>Monthly Badges</Text>
                <Text>🏅 3 Badges earned</Text>
            </View>

            {/* Achievements */}
            <View style={styles.box}>
                <Text style={styles.boxTitle}>Achievements</Text>
                <Text>✅ Completed 1 module</Text>
                <Text>✅ Logged in 5 days in a row</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    box: { backgroundColor: '#1e1e1e', borderRadius: 15, padding: 15, marginBottom: 15 },
    boxTitle: { color: '#fff', fontWeight: '700', marginBottom: 8 },
});
