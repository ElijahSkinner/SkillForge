import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function CourseScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center' }}>
            <Text style={styles.title}>Network+ Modules</Text>

            <Pressable style={styles.moduleCard}>
                <Text style={styles.moduleTitle}>Module 1: Networking Basics</Text>
                <Link href="/(tabs)/quiz">
                    <Text style={styles.startQuiz}>Start Quiz</Text>
                </Link>
            </Pressable>

            <Pressable style={styles.moduleCard}>
                <Text style={styles.moduleTitle}>Module 2: IP Addressing & Subnets</Text>
                <Link href="/(tabs)/quiz">
                    <Text style={styles.startQuiz}>Start Quiz</Text>
                </Link>
            </Pressable>

            <Pressable style={styles.moduleCard}>
                <Text style={styles.moduleTitle}>Module 3: Protocols & Ports</Text>
                <Link href="/(tabs)/quiz">
                    <Text style={styles.startQuiz}>Start Quiz</Text>
                </Link>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f1f3f6' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
    moduleCard: {
        width: '90%',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    moduleTitle: { fontSize: 18, fontWeight: 'bold' },
    startQuiz: { color: '#007bff', marginTop: 10 },
});
