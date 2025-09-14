import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// Placeholder mistakes data
const mistakesData = [
    { id: 1, question: 'What does DHCP stand for?', correctAnswer: 'Dynamic Host Configuration Protocol', userAnswer: 'Dynamic Host Control Protocol' },
    { id: 2, question: 'Which port does HTTP use?', correctAnswer: '80', userAnswer: '8080' },
    { id: 3, question: 'What component initializes the computer?', correctAnswer: 'BIOS', userAnswer: 'UEFI' },
];

export default function ReviewMistakes() {
    const router = useRouter();

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.title}>Review Mistakes</Text>

            {mistakesData.length === 0 ? (
                <Text style={styles.noMistakes}>No mistakes to review! 🎉</Text>
            ) : (
                mistakesData.map((m) => (
                    <View key={m.id} style={styles.card}>
                        <Text style={styles.question}>{m.question}</Text>
                        <Text style={styles.label}>Your Answer:</Text>
                        <Text style={styles.userAnswer}>{m.userAnswer}</Text>
                        <Text style={styles.label}>Correct Answer:</Text>
                        <Text style={styles.correctAnswer}>{m.correctAnswer}</Text>
                    </View>
                ))
            )}

            <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backText}>Back to Today</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    title: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    noMistakes: { color: '#fff', fontSize: 16 },
    card: {
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    question: { color: '#fff', fontWeight: '600', fontSize: 16, marginBottom: 8 },
    label: { color: '#aaa', fontSize: 12, marginTop: 4 },
    userAnswer: { color: '#f56565', fontSize: 14, fontWeight: '500' },
    correctAnswer: { color: '#48bb78', fontSize: 14, fontWeight: '500' },
    backButton: {
        marginTop: 20,
        backgroundColor: '#27b0b9',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    backText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
