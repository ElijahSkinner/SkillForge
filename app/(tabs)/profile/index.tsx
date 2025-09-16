import { View, Text, StyleSheet, ScrollView, Pressable, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { account, databases } from '@/context/AuthContext'; // adjust path
import { Query } from "appwrite";

const DATABASE_ID = "your_database_id";
const COLLECTION_ID = "user_progress";

export default function ProfileScreen() {
    const router = useRouter();

    const [streak, setStreak] = useState(0);
    const [docId, setDocId] = useState(null); // store progress doc id

    // Fetch user streak on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await account.get();
                const res = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal("userID", user.$id)]
                );

                if (res.documents.length > 0) {
                    const doc = res.documents[0];
                    setStreak(doc.currentStreak || 0);
                    setDocId(doc.$id);
                }
            } catch (err) {
                console.error("Error fetching streak:", err);
            }
        };
        fetchData();
    }, []);

    // Update streak in DB
    const updateStreak = async (newStreak) => {
        try {
            if (!docId) return;
            await databases.updateDocument(DATABASE_ID, COLLECTION_ID, docId, {
                currentStreak: newStreak,
            });
            setStreak(newStreak);
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
                    <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
                        <Button title="➕ Increase" onPress={() => updateStreak(streak + 1)} />
                        <Button title="➖ Decrease" onPress={() => updateStreak(Math.max(0, streak - 1))} />
                    </View>
                </View>
                /
                <Text>Total XP: 420</Text>
                <Text>Current League: BAB</Text>
                <Text>Top Score: CompTIA Net+ - 95%</Text>


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
    boxTitle: { color: '222222', fontWeight: '700', marginBottom: 8 },
});
