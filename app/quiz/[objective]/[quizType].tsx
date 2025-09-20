// app/quiz/[objective]/[quizType].tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuizScreen from '@/components/QuizScreen';

export default function QuizRoute() {
    const params = useLocalSearchParams();

    console.log('🎯 QuizRoute component loaded!');
    console.log('📊 Params received:', JSON.stringify(params, null, 2));

    // Test with simple content first, then use QuizScreen
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                    🎯 QUIZ ROUTE WORKS!
                </Text>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
                    Objective: {params.objective}
                </Text>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
                    Quiz Type: {params.quizType}
                </Text>

                {/* Uncomment this when the basic route works */}
                <QuizScreen />
            </View>
        </SafeAreaView>
    );
}