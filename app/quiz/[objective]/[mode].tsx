// app/quiz/[objective]/[mode].tsx - Updated quiz route with practice/test modes
import React from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import QuizScreen from '../../../components/QuizScreen';

export default function QuizModeRoute() {
    const params = useLocalSearchParams<{
        objective: string;
        mode: 'practice' | 'test';
    }>();

    return (
        <View style={{ flex: 1 }}>
            <QuizScreen mode={params.mode || 'test'} />
        </View>
    );
}