// app/quiz/[objective]/[quizType].tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QuizRoute() {
    const params = useLocalSearchParams();

    console.log('🎯 QuizRoute component loaded!');
    console.log('📊 Params received:', JSON.stringify(params, null, 2));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
                    🎯 QUIZ ROUTE WORKS!
                </Text>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                    Objective: {params.objective}
                </Text>
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center' }}>
                    Quiz Type: {params.quizType}
                </Text>
                <Text style={{ color: 'white', fontSize: 14, marginTop: 20, textAlign: 'center' }}>
                    If you can see this, the route is working!
                </Text>
            </View>
        </SafeAreaView>
    );
}