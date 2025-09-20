// components/modals/LessonSelectionModal.tsx
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';
import { useRouter } from 'expo-router';
import { DOMAIN_1_QUIZZES } from '@/constants/quizData';

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
    onStart: () => void;   // <- keep this for non-quiz lessons
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


    const hasQuiz = DOMAIN_1_QUIZZES[`${lesson.modId}.${lesson.lessonIndex}`] !== undefined;

    // 🟢 New handler that merges lesson start + quiz redirect
    const handleLessonStart = async () => {
        if (hasQuiz) {
            router.push({
                pathname: '/quiz/[objective]/[quizType]' as any,
                params: {
                    objective: `${lesson.modId}.${lesson.lessonIndex}`,
                    quizType: 'quizA',
                },
            });
            onClose();
        } else {
            onStart(); // fallback to normal lesson flow
        }
    };

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <View style={{ alignItems: 'center' }}>
                {/* Title + Name */}
                <ThemedText variant="h3" color="primary" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
                    {isUnitReview ? 'Unit Review' : `Lesson ${lessonDisplayNumber}`}
                </ThemedText>

                <ThemedText variant="h4" color="text" style={{ marginBottom: theme.spacing.md, textAlign: 'center' }}>
                    {lesson.lessonName}
                </ThemedText>

                {/* XP Badge */}
                <View style={{
                    backgroundColor: theme.gamification?.xp?.backgroundColor || `${theme.colors.primary}20`,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.sm,
                    borderRadius: theme.borderRadius.lg,
                    marginBottom: theme.spacing.lg,
                }}>
                    <ThemedText variant="body1" style={{ color: theme.gamification?.xp?.color || theme.colors.primary, fontWeight: 'bold' }}>
                        +{xp} XP
                    </ThemedText>
                </View>

                {/* Description */}
                <ThemedText variant="body2" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
                    {isUnitReview
                        ? 'Review all concepts from this module and test your knowledge'
                        : 'Complete this lesson to earn XP and unlock the next challenge'}
                </ThemedText>

                {/* Action Buttons */}
                <View style={{ width: '100%', gap: theme.spacing.md }}>
                    <ThemedButton
                        title={loading ? 'Starting...' : hasQuiz ? 'Start Quiz' : 'Start Lesson'}
                        onPress={handleLessonStart}
                        disabled={loading}
                        variant="primary"
                    />

                    <ThemedButton
                        title="Cancel"
                        onPress={onClose}
                        variant="outline"
                    />

                    {/* Optional: still show explicit quiz buttons */}
                    {hasQuiz && (
                        <View style={{ gap: theme.spacing.md, marginTop: theme.spacing.md }}>
                            <ThemedButton
                                title="Take Quiz A"
                                onPress={() => {
                                    router.push({
                                        pathname: '/quiz/[objective]/[quizType]' as any,
                                        params: {
                                            objective: `${lesson.modId}.${lesson.lessonIndex}`,  // Fixed
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
                                            objective: `${lesson.modId}.${lesson.lessonIndex}`,  // Fixed
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
