// components/modals/LessonSelectionModal.tsx - FIXED: Moved useMemo, fixed color type, fixed apostrophes
import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCert } from '../../context/CertContext';
import { ThemedModal, ThemedText, ThemedButton, ThemedBadge } from '../themed';

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

    const isUnitReview = lesson?.lessonIndex === 0;
    const objective = lesson ? `${lesson.modId}.${lesson.lessonIndex}` : '';

    // Calculate lesson state - MOVED OUTSIDE OF CONDITIONAL
    const lessonState = useMemo(() => {
        if (!progress || !selectedCert || !lesson) {
            return {
                hasViewedContent: false,
                hasCompletedPractice: false,
                hasPassedTest: false,
                practiceScore: 0,
                testScore: 0
            };
        }

        const viewedContent = progress.viewedLessonContent || [];
        const practiceScores = progress.practiceScores || {};
        const completedQuizzes = progress.completedQuizzes || [];

        const contentKey = `${selectedCert}_${objective}`;
        const practiceKey = `${selectedCert}_${lesson.modId}_${lesson.lessonIndex}_practice`;
        const testKeyA = `${selectedCert}_${lesson.modId}_${lesson.lessonIndex}_quizA`;
        const testKeyB = `${selectedCert}_${lesson.modId}_${lesson.lessonIndex}_quizB`;

        return {
            hasViewedContent: viewedContent.includes(contentKey),
            hasCompletedPractice: practiceScores[practiceKey] !== undefined,
            hasPassedTest: completedQuizzes.includes(testKeyA) || completedQuizzes.includes(testKeyB),
            practiceScore: practiceScores[practiceKey] || 0,
            testScore: 0
        };
    }, [progress, selectedCert, objective, lesson]);

    // Return early if no lesson
    if (!lesson) return null;

    // Navigation handlers
    const navigateToLesson = () => {
        onClose();
        router.push(`/learn/${objective}` as any);
    };

    const navigateToQuiz = (mode: 'practice' | 'test') => {
        onClose();
        router.push(`/quiz/${objective}/${mode}` as any);
    };

    const xp = isUnitReview
        ? lesson.moduleWeight
        : Math.round(lesson.moduleWeight / lesson.totalLessons);

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <View style={{ alignItems: 'center' }}>
                {/* Title */}
                <ThemedText variant="h3" color="primary" style={{
                    marginBottom: theme.spacing.sm,
                    textAlign: 'center'
                }}>
                    {isUnitReview ? 'Unit Review' : `Lesson ${lesson.lessonIndex} / ${lesson.totalLessons}`}
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

                {/* Progress Status */}
                <View style={{
                    width: '100%',
                    backgroundColor: theme.colors.surfaceVariant,
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.md,
                    marginBottom: theme.spacing.lg
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
                        <Ionicons
                            name={lessonState.hasViewedContent ? "checkmark-circle" : "ellipse-outline"}
                            size={20}
                            color={lessonState.hasViewedContent ? theme.colors.success : theme.colors.textSecondary}
                        />
                        <ThemedText variant="body2" style={{ marginLeft: theme.spacing.sm }}>
                            Learn the material
                        </ThemedText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
                        <Ionicons
                            name={lessonState.hasCompletedPractice ? "checkmark-circle" : "ellipse-outline"}
                            size={20}
                            color={lessonState.hasCompletedPractice ? theme.colors.success : theme.colors.textSecondary}
                        />
                        <ThemedText variant="body2" style={{ marginLeft: theme.spacing.sm }}>
                            Practice quiz {lessonState.practiceScore > 0 ? `(${lessonState.practiceScore}%)` : ''}
                        </ThemedText>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons
                            name={lessonState.hasPassedTest ? "checkmark-circle" : "ellipse-outline"}
                            size={20}
                            color={lessonState.hasPassedTest ? theme.colors.success : theme.colors.textSecondary}
                        />
                        <ThemedText variant="body2" style={{ marginLeft: theme.spacing.sm }}>
                            Pass the test
                        </ThemedText>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={{ width: '100%', gap: theme.spacing.md }}>
                    {/* Learn Button */}
                    <ThemedButton
                        title={lessonState.hasViewedContent ? "📚 Review Lesson" : "📚 Start Learning (5 min)"}
                        onPress={navigateToLesson}
                        variant={!lessonState.hasViewedContent ? "primary" : "outline"}
                        style={{
                            opacity: lessonState.hasPassedTest ? 0.7 : 1
                        }}
                    />

                    {/* Practice Quiz Button */}
                    <View>
                        <ThemedButton
                            title={lessonState.hasCompletedPractice ? "🎯 Practice Again" : "🎯 Practice Quiz"}
                            onPress={() => navigateToQuiz('practice')}
                            variant={lessonState.hasViewedContent && !lessonState.hasCompletedPractice ? "primary" : "secondary"}
                            disabled={!lessonState.hasViewedContent}
                        />
                        {!lessonState.hasViewedContent && (
                            <ThemedText variant="caption" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
                                Complete the lesson first
                            </ThemedText>
                        )}
                    </View>

                    {/* Test Button */}
                    <View>
                        <ThemedButton
                            title={lessonState.hasPassedTest ? "✅ Retake Test" : "✅ Take Test (Counts for XP)"}
                            onPress={() => navigateToQuiz('test')}
                            variant={lessonState.hasCompletedPractice && !lessonState.hasPassedTest ? "primary" : "outline"}
                            disabled={!lessonState.hasCompletedPractice}
                        />
                        {!lessonState.hasCompletedPractice && (
                            <ThemedText variant="caption" color="textSecondary" style={{ textAlign: 'center', marginTop: 4 }}>
                                Complete practice quiz first
                            </ThemedText>
                        )}
                        {lessonState.hasPassedTest && (
                            <ThemedText variant="caption" color="success" style={{ textAlign: 'center', marginTop: 4 }}>
                                ✓ Test passed! You&apos;ve earned your XP
                            </ThemedText>
                        )}
                    </View>

                    {/* Cancel Button */}
                    <ThemedButton
                        title="Cancel"
                        onPress={onClose}
                        variant="outline"
                    />
                </View>

                {/* Help Text */}
                <ThemedText
                    variant="caption"
                    color="textSecondary"
                    style={{
                        textAlign: 'center',
                        marginTop: theme.spacing.md,
                        lineHeight: 18
                    }}
                >
                    {!lessonState.hasViewedContent && "Start by learning the material, then practice with unlimited attempts."}
                    {lessonState.hasViewedContent && !lessonState.hasCompletedPractice && "Practice mode gives instant feedback and doesn&apos;t count toward your score."}
                    {lessonState.hasCompletedPractice && !lessonState.hasPassedTest && "Ready for the real test? You need 70% to pass and earn XP."}
                    {lessonState.hasPassedTest && "Lesson complete! You can retake anytime to improve your score."}
                </ThemedText>
            </View>
        </ThemedModal>
    );
}