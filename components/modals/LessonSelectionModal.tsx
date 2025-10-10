// components/modals/LessonSelectionModal.tsx - UPDATED WITH SMART QUIZ SELECTION
import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCert } from '../../context/CertContext';
import { ThemedModal, ThemedText, ThemedButton } from '../../components/themed';
import { useRouter } from 'expo-router';
import { DOMAIN_1_QUIZZES, DOMAIN_2_QUIZZES } from '../../constants/quizData';

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
    const { progress } = useAuth();
    const { selectedCert } = useCert();

    if (!lesson) return null;

    const isUnitReview = lesson.lessonIndex === 0;
    const lessonDisplayNumber = isUnitReview
        ? 'Unit Review'
        : `${lesson.lessonIndex} / ${lesson.totalLessons}`;
    const xp = isUnitReview
        ? lesson.moduleWeight
        : Math.round(lesson.moduleWeight / lesson.totalLessons);

    // Get quiz data based on module
    const getQuizData = () => {
        switch (lesson.modId) {
            case 1:
                return DOMAIN_1_QUIZZES;
            case 2:
                return DOMAIN_2_QUIZZES;
            default:
                return {};
        }
    };

    const quizData = getQuizData();
    const objectiveKey = `${lesson.modId}.${lesson.lessonIndex}`;
    const hasQuiz = quizData[objectiveKey] !== undefined;

    // Smart quiz selection logic
    const getNextQuiz = (): 'quizA' | 'quizB' => {
        if (!progress || !selectedCert) return 'quizA';

        const completedQuizzes = progress.completedQuizzes || [];
        const baseKey = `${selectedCert}_${lesson.modId}_${lesson.lessonIndex}`;

        const hasCompletedA = completedQuizzes.includes(`${baseKey}_quizA`);
        const hasCompletedB = completedQuizzes.includes(`${baseKey}_quizB`);

        // If neither completed, start with Quiz A
        if (!hasCompletedA) return 'quizA';

        // If only A completed, do Quiz B
        if (!hasCompletedB) return 'quizB';

        // Both completed - let them retake Quiz A
        return 'quizA';
    };

    const getQuizButtonText = (): string => {
        if (!progress || !selectedCert || !hasQuiz) return 'Start Lesson';

        const completedQuizzes = progress.completedQuizzes || [];
        const baseKey = `${selectedCert}_${lesson.modId}_${lesson.lessonIndex}`;

        const hasCompletedA = completedQuizzes.includes(`${baseKey}_quizA`);
        const hasCompletedB = completedQuizzes.includes(`${baseKey}_quizB`);

        if (!hasCompletedA) return 'Start Quiz';
        if (!hasCompletedB) return 'Continue Quiz (Part 2)';
        return 'Retake Quiz';
    };

    const handleLessonStart = () => {
        if (hasQuiz) {
            const nextQuiz = getNextQuiz();
            const route = `/quiz/${objectiveKey}/${nextQuiz}`;
            console.log('🎯 Starting quiz:', route);
            router.push(route as any);
            onClose();
        } else {
            // No quiz available, use default lesson flow
            onStart();
        }
    };

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <View style={{ alignItems: 'center' }}>
                {/* Title + Name */}
                <ThemedText variant="h3" color="primary" style={{
                    marginBottom: theme.spacing.sm,
                    textAlign: 'center'
                }}>
                    {isUnitReview ? 'Unit Review' : `Lesson ${lessonDisplayNumber}`}
                </ThemedText>

                <ThemedText variant="h4" color="text" style={{
                    marginBottom: theme.spacing.md,
                    textAlign: 'center'
                }}>
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
                    <ThemedText variant="body1" style={{
                        color: theme.gamification?.xp?.color || theme.colors.primary,
                        fontWeight: 'bold'
                    }}>
                        +{xp} XP
                    </ThemedText>
                </View>

                {/* Description */}
                <ThemedText variant="body2" color="textSecondary" style={{
                    textAlign: 'center',
                    marginBottom: theme.spacing.xl
                }}>
                    {isUnitReview
                        ? 'Review all concepts from this module and test your knowledge'
                        : hasQuiz
                            ? 'Test your knowledge with an interactive quiz'
                            : 'Complete this lesson to earn XP and unlock the next challenge'}
                </ThemedText>

                {/* Action Buttons */}
                <View style={{ width: '100%', gap: theme.spacing.md }}>
                    <ThemedButton
                        title={loading ? 'Starting...' : getQuizButtonText()}
                        onPress={handleLessonStart}
                        disabled={loading}
                        variant="primary"
                    />

                    <ThemedButton
                        title="Cancel"
                        onPress={onClose}
                        variant="outline"
                    />
                </View>
            </View>
        </ThemedModal>
    );
}