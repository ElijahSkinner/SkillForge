// components/modals/LessonSelectionModal.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';
import { useRouter } from 'expo-router';
import {  } from '@/constants/quizData'; // make sure this import points to your quiz data file

interface LessonSelectionModalProps {
    visible: boolean;
    lesson: {
        modId: number;
        lessonIndex: number;
        lessonName: string;
        moduleWeight: number;
        totalLessons: number;
    } | null;
    onClose: () => void;
    onStart: () => void;
    loading: boolean;
}

export default function LessonSelectionModal({
                                                 visible,
                                                 lesson,
                                                 onClose,
                                                 onStart,
                                                 loading
                                             }: LessonSelectionModalProps) {
    const { theme } = useTheme();
    const router = useRouter();

    if (!lesson) return null;

    const isUnitReview = lesson.lessonIndex === 0;
    const lessonDisplayNumber = isUnitReview
        ? 'Unit Review'
        : `${lesson.lessonIndex} / ${lesson.totalLessons}`;
    const xp = isUnitReview
        ? lesson.moduleWeight
        : Math.round(lesson.moduleWeight / lesson.totalLessons);

    // check if quizzes exist for this lesson
    const hasQuiz = QUIZ_DATA[`1.${lesson.lessonIndex}`];

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <View style={{ alignItems: 'center' }}>
                {/* Lesson Title */}
                <ThemedText
                    variant="h3"
                    color="primary"
                    style={{
                        marginBottom: theme.spacing.sm,
                        textAlign: 'center'
                    }}
                >
                    {isUnitReview ? 'Unit Review' : `Lesson ${lessonDisplayNumber}`}
                </ThemedText>

                {/* Lesson Name */}
                <ThemedText
                    variant="h4"
                    color="text"
                    style={{
                        marginBottom: theme.spacing.md,
                        textAlign: 'center'
                    }}
                >
                    {lesson.lessonName}
                </ThemedText>

                {/* XP Badge */}
                <View
                    style={{
                        backgroundColor: theme.gamification?.xp?.backgroundColor || `${theme.colors.primary}20`,
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.sm,
                        borderRadius: theme.borderRadius.lg,
                        marginBottom: theme.spacing.lg,
                    }}
                >
                    <ThemedText
                        variant="body1"
                        style={{
                            color: theme.gamification?.xp?.color || theme.colors.primary,
                            fontWeight: 'bold'
                        }}
                    >
                        +{xp} XP
                    </ThemedText>
                </View>

                {/* Lesson Description/Type */}
                <ThemedText
                    variant="body2"
                    color="textSecondary"
                    style={{
                        textAlign: 'center',
                        marginBottom: theme.spacing.xl,
                    }}
                >
                    {isUnitReview
                        ? 'Review all concepts from this module and test your knowledge'
                        : 'Complete this lesson to earn XP and unlock the next challenge'}
                </ThemedText>

                {/* Action Buttons */}
                <View style={{ width: '100%', gap: theme.spacing.md }}>
                    <ThemedButton
                        title={loading ? 'Starting...' : 'Start Lesson'}
                        onPress={onStart}
                        disabled={loading}
                        variant="primary"
                    />

                    <ThemedButton
                        title="Cancel"
                        onPress={onClose}
                        variant="outline"
                    />

                    {/* Quiz Buttons (only show if quizzes exist) */}
                    {hasQuiz && (
                        <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.md }}>
                            <ThemedButton
                                title="Take Quiz A"
                                onPress={() => {
                                    router.push({
                                        pathname: '/quiz/[objective]/[quizType]' as any,
                                        params: {
                                            objective: `1.${lesson.lessonIndex}`,
                                            quizType: 'quizA'
                                        }
                                    });
                                    onClose();
                                }}
                            />
                            <ThemedButton
                                title="Take Quiz B"
                                variant="outline"
                                onPress={() => {
                                    router.push({
                                        pathname: '/quiz/[objective]/[quizType]' as any,
                                        params: {
                                            objective: `1.${lesson.lessonIndex}`,
                                            quizType: 'quizB'
                                        }
                                    });
                                    onClose();
                                }}
                            />
                        </View>
                    )}
                </View>
            </View>
        </ThemedModal>
    );
}
