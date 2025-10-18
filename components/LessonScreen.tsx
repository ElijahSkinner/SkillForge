// New file: components/LessonScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { LESSON_CONTENT } from '../constants/lessonContent';

export default function LessonScreen({ objective, onComplete }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const lesson = LESSON_CONTENT[objective];

    // Break lesson content into digestible slides
    const slides = [
        { type: 'intro', content: lesson.introduction },
        { type: 'concept', content: lesson.keyPoints },
        { type: 'example', content: lesson.realWorldScenario },
        // Add interactive elements between slides
    ];

    return (
        <ScrollView>
            {/* Show one slide at a time */}
            {/* Progress indicator */}
            {/* Next/Previous navigation */}
            {/* Complete button when done */}
        </ScrollView>
    );
}