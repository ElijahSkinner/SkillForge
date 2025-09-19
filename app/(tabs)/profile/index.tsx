import { View, Text, StyleSheet, ScrollView, Pressable, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { progress, databases } = useAuth();

    const [streak, setStreak] = useState(0);

    // Initialize streak from progress
    useEffect(() => {
        if (progress) {
            setStreak(progress.currentStreak || 0);
        }
    }, [progress]);

    // Update streak in DB
    const updateStreak = async (newStreak: number) => {
        if (!progress) return;
        try {
            const updated = await databases.updateDocument(
                "68c9a6a6000cf7733309", // DATABASE_ID
                "68c9a6b7002dfd514488", // COLLECTION_ID
                progress.$id,
                { currentStreak: newStreak }
            );
            setStreak(updated.currentStreak);
        } catch (err) {
            console.error("Error updating streak:", err);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
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

                    {/* Test buttons */}
                    <View style={{colors: theme.colors.ripple, flexDirection: "row", marginTop: 10, gap: 10 }}>
                        <Button title="➕ Increase" onPress={() => updateStreak(streak + 1)} />
                        <Button title="➖ Decrease" onPress={() => updateStreak(Math.max(0, streak - 1))} />
                    </View>

                    {/* Other overview info */}
                    <Text>Total XP: {progress?.xp || 0}</Text>
                    <Text>Current League: BAB</Text>
                    <Text>Top Score: CompTIA Net+ - 95%</Text>
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    title: { color: '#fee37f', fontSize: 24, fontWeight: 'bold' },
    box: { backgroundColor: '#fee37f', borderRadius: 15, padding: 15, marginBottom: 15 },
    boxTitle: { color: '#222222', fontWeight: '700', marginBottom: 8 },
});
