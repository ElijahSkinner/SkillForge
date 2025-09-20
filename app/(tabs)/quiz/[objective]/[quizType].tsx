// app/(tabs)/quiz/[objective]/[quizType].tsx
// This creates the route structure for quizzes
import QuizScreen from '@/components/QuizScreen';
export default QuizScreen;import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QuizScreen from '@/components/QuizScreen';

export default function QuizRoute() {
    console.log('QuizRoute wrapper rendering');
    const params = useLocalSearchParams();
    console.log('Route params:', params);

    // First test if this component renders at all
    return (
        <View style={{ flex: 1 }}>
            <Text>Quiz Route Wrapper - Params: {JSON.stringify(params)}</Text>
            <QuizScreen />
        </View>
    );
}