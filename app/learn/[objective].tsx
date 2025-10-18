
// app/learn/[objective].tsx - Learning content route
import React from 'react';
import { View } from 'react-native';
import LessonScreen from '../../components/LessonScreen';

export default function LearnRoute() {
    return (
        <View style={{ flex: 1 }}>
            <LessonScreen />
        </View>
    );
}