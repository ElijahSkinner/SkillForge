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

    // Debug and navigation handler
    const handleLessonStart = async () => {
        console.log('🔥 BUTTON PRESSED!');
        console.log('📝 Lesson data:', lesson);
        console.log('❓ Has quiz:', hasQuiz);

        if (hasQuiz) {
            const objective = `${lesson.modId}.${lesson.lessonIndex}`;
            const route = `/quiz/${objective}/quizA`;

            console.log('🎯 Objective:', objective);
            console.log('🛣️ Full route:', route);
            console.log('🧭 Router object:', router);

            try {
                console.log('🚀 Attempting navigation...');
                router.push(route as any);
                console.log('✅ Navigation call completed');
                onClose();
            } catch (error) {
                console.error('❌ Navigation failed:', error);
            }
        } else {
            console.log('📚 No quiz, calling onStart');
            onStart();
        }
    };

    const handleQuizNavigation = (quizType: 'quizA' | 'quizB') => {
        const objective = `${lesson.modId}.${lesson.lessonIndex}`;
        const route = `/quiz/${objective}/${quizType}`;

        console.log('🎯 Quiz navigation - Objective:', objective);
        console.log('🛣️ Quiz route:', route);

        try {
            router.push(route as any);
            onClose();
        } catch (error) {
            console.error('❌ Quiz navigation failed:', error);
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

                {/* Debug Info (Remove this after testing) */}
                <View style={{ marginBottom: theme.spacing.md, padding: theme.spacing.sm, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: theme.borderRadius.sm }}>
                    <ThemedText variant="caption" style={{ textAlign: 'center' }}>
                        Debug: {lesson.modId}.{lesson.lessonIndex} | Has Quiz: {hasQuiz ? 'Yes' : 'No'}
                    </ThemedText>
                </View>

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
                                onPress={() => handleQuizNavigation('quizA')}
                            />
                            <ThemedButton
                                title="Take Quiz B"
                                variant="outline"
                                onPress={() => handleQuizNavigation('quizB')}
                            />
                        </View>
                    )}
                </View>
            </View>
        </ThemedModal>
    );
}