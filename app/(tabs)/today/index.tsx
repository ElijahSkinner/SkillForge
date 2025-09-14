import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function TodayReviewScreen() {
    const router = useRouter();

    // Placeholder data
    const mistakes = [
        { id: 1, term: 'IP Address', module: 'Networking' },
        { id: 2, term: 'BIOS', module: 'Hardware' },
    ];

    const wordsLearned = ['Subnet', 'DHCP', 'Motherboard'];

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.title}>Today’s Review</Text>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <Pressable
                    style={styles.actionButton}
                    onPress={() => router.push('/quiz')}
                >
                    <Text style={styles.actionText}>Continue Next Module</Text>
                </Pressable>
                <Pressable
                    style={styles.actionButton}
                    onPress={() => router.push('/review/mistakes')}
                >
                    <Text style={styles.actionText}>Review Mistakes</Text>
                </Pressable>
            </View>

            {/* Mistakes Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Mistakes</Text>
                {mistakes.map((m) => (
                    <View key={m.id} style={styles.itemCard}>
                        <Text style={styles.itemText}>{m.term}</Text>
                        <Text style={styles.itemSubText}>{m.module}</Text>
                    </View>
                ))}
            </View>

            {/* Words Learned */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Words / Terms Learned</Text>
                {wordsLearned.map((w, idx) => (
                    <View key={idx} style={styles.itemCard}>
                        <Text style={styles.itemText}>{w}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    section: { marginBottom: 25 },
    sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 10 },
    actionButton: {
        backgroundColor: '#27b0b9',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
    },
    actionText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    itemCard: {
        backgroundColor: '#1e1e1e',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    itemText: { color: '#fff', fontWeight: '500', fontSize: 16 },
    itemSubText: { color: '#aaa', fontSize: 12, marginTop: 2 },
});
