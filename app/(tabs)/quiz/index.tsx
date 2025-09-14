import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';

const sampleQuestion = {
    question: 'What is a subnet mask?',
    options: ['255.255.255.0', '255.0.0.0', '255.255.0.0', '255.255.255.255'],
    correctIndex: 0,
};

export default function QuizScreen() {
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => setSubmitted(true);

    return (
        <View style={styles.container}>
            <Text style={styles.question}>{sampleQuestion.question}</Text>

            {sampleQuestion.options.map((opt, idx) => (
                <Pressable
                    key={idx}
                    style={[
                        styles.option,
                        selected === idx && { borderColor: '#007bff' },
                        submitted && idx === sampleQuestion.correctIndex && { backgroundColor: '#d4edda' },
                        submitted && selected === idx && selected !== sampleQuestion.correctIndex && { backgroundColor: '#f8d7da' },
                    ]}
                    onPress={() => setSelected(idx)}
                >
                    <Text>{opt}</Text>
                </Pressable>
            ))}

            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit Answer</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center' },
    question: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    option: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
    },
    submitBtn: {
        marginTop: 20,
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
});
