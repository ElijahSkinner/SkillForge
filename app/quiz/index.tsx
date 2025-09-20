// app/(tabs)/quiz/index.tsx
import { View, StyleSheet } from 'react-native';
import QuizRoadmap from '@/components/QuizRoadmap';

export default function QuizPage() {
    return (
        <View style={styles.container}>
            <QuizRoadmap />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
});
