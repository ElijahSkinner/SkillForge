import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QuizScreen from '@/components/QuizScreen';

export default function QuizRoute() {
    const params = useLocalSearchParams();

    return (
        <View style={{ flex: 1 }}>
            <QuizScreen />
        </View>
    );
}