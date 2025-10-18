// components/QuizScreen.tsx - UPDATED with practice/test modes and mistake tracking
import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView, ThemedText, ThemedButton } from '../components/themed';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCert } from '../context/CertContext';
import {
    DOMAIN_1_QUIZZES,
    DOMAIN_2_QUIZZES,
} from '../constants/quizData';
import QuizQuestionComponent from './QuizQuestion';
import QuizExitModal from './modals/QuizExitModal';

interface QuizScreenProps {
    mode?: 'practice' | 'test';
}

export default function QuizScreen({ mode = 'test' }: QuizScreenProps) {
    const { objective } = useLocalSearchParams<{
        objective: string;
    }>();

    const { theme } = useTheme();
    const router = useRouter();
    const { progress, addCompletedQuiz, savePracticeScore, addMistakeToReview } = useAuth();
    const { selectedCert } = useCert();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ isCorrect: boolean; userAnswer: any }[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    const isPracticeMode = mode === 'practice';

    // Gather all domains
    const ALL_DOMAINS: Record<string, any> = {
        ...DOMAIN_1_QUIZZES,
        ...DOMAIN_2_QUIZZES,
    };

    // For practice mode, use quizA. For test mode, intelligently select quiz
    const getQuizType = (): 'quizA' | 'quizB' => {
        if (isPracticeMode) return 'quizA'; // Practice always uses quizA

        // Test mode: Check which quiz hasn't been completed yet
        if (!progress || !selectedCert || !objective) return 'quizA';

        const completedQuizzes = progress.completedQuizzes || [];
        const [moduleId, lessonIndex] = objective.split('.').map(Number);
        const baseKey = `${selectedCert}_${moduleId}_${lessonIndex}`;

        const hasCompletedA = completedQuizzes.includes(`${baseKey}_quizA`);
        const hasCompletedB = completedQuizzes.includes(`${baseKey}_quizB`);

        if (!hasCompletedA) return 'quizA';
        if (!hasCompletedB) return 'quizB';
        return 'quizA'; // Both completed, allow retake of A
    };

    const quizType = getQuizType();
    const quiz = ALL_DOMAINS[objective!]?.[quizType];

    const handleExit = () => {
        setShowExitModal(true);
    };

    const confirmExit = () => {
        setShowExitModal(false);
        router.back();
    };

    const cancelExit = () => {
        setShowExitModal(false);
    };

    if (!quiz) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Quiz not found</ThemedText>
                <ThemedButton title="Go Back" onPress={() => router.back()} />
            </ThemedView>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const quizProgress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    const handleAnswer = async (isCorrect: boolean, userAnswer: any) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = { isCorrect, userAnswer };
        setAnswers(newAnswers);

        // Track mistakes in practice mode for review
        if (isPracticeMode && !isCorrect) {
            try {
                const [moduleId, lessonIndex] = (objective || '').split('.').map(Number);

                await addMistakeToReview({
                    questionId: `${objective}_${currentQuestion.id}`,
                    question: currentQuestion.question,
                    objective: objective || '',
                    module: `Module ${moduleId}`,
                    yourAnswer: String(userAnswer),
                    correctAnswer: String(currentQuestion.correct),
                    explanation: currentQuestion.explanation,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Failed to track mistake:', error);
            }
        }

        setShowResult(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowResult(false);
        } else {
            setQuizCompleted(true);
        }
    };

    const calculateScore = () => {
        const correct = answers.filter(answer => answer.isCorrect).length;
        return Math.round((correct / quiz.questions.length) * 100);
    };

    const handleQuizComplete = async () => {
        const score = calculateScore();

        if (selectedCert && objective) {
            const [moduleId, lessonIndex] = objective.split('.').map(Number);

            try {
                if (isPracticeMode) {
                    // Save practice score (no XP, just tracking)
                    await savePracticeScore(selectedCert, moduleId, lessonIndex, score);
                    console.log('✅ Practice score saved');
                } else {
                    // Test mode: Track completion if passing
                    await addCompletedQuiz(
                        selectedCert,
                        moduleId,
                        lessonIndex,
                        quizType,
                        score
                    );
                    console.log('✅ Test completion tracked');
                }
            } catch (error) {
                console.error('Failed to track quiz:', error);
            }
        }

        router.back();
    };

    if (quizCompleted) {
        const score = calculateScore();
        const passed = score >= 70;

        return (
            <ThemedView style={{ flex: 1 }}>
                <Stack.Screen options={{ headerShown: false }} />
                <SafeAreaView style={{ flex: 1, padding: theme.spacing.lg }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Success/Failure Icon */}
                        <View style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: isPracticeMode
                                ? theme.colors.info + '20'
                                : passed
                                    ? theme.colors.success + '20'
                                    : theme.colors.warning + '20',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: theme.spacing.lg
                        }}>
                            <Ionicons
                                name={isPracticeMode ? "bulb" : passed ? "checkmark-circle" : "alert-circle"}
                                size={60}
                                color={isPracticeMode ? theme.colors.info : passed ? theme.colors.success : theme.colors.warning}
                            />
                        </View>

                        <ThemedText variant="h2" style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}>
                            {isPracticeMode
                                ? 'Practice Complete!'
                                : passed
                                    ? 'Quiz Complete!'
                                    : 'Keep Studying!'}
                        </ThemedText>

                        <ThemedText
                            variant="h3"
                            style={{
                                marginBottom: theme.spacing.lg,
                                color: isPracticeMode ? theme.colors.info : passed ? theme.colors.success : theme.colors.warning,
                            }}
                        >
                            Your Score: {score}%
                        </ThemedText>

                        <ThemedText
                            variant="body1"
                            style={{
                                textAlign: 'center',
                                marginBottom: theme.spacing.xl,
                                paddingHorizontal: theme.spacing.lg
                            }}
                        >
                            {isPracticeMode
                                ? score >= 70
                                    ? "Great practice! You're ready for the real test. 💪"
                                    : "Good effort! Review the material and try the practice quiz again."
                                : passed
                                    ? score >= 90
                                        ? "Outstanding! You've mastered this topic. 🌟"
                                        : "Great job! You've passed this quiz. Keep up the good work! 💪"
                                    : "Don't worry! Review the material and try again. You've got this! 📚"
                            }
                        </ThemedText>

                        {/* Stats */}
                        <View style={{
                            backgroundColor: theme.colors.surface,
                            padding: theme.spacing.lg,
                            borderRadius: theme.borderRadius.md,
                            width: '100%',
                            marginBottom: theme.spacing.xl
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                <View style={{ alignItems: 'center' }}>
                                    <ThemedText variant="h3" color="success">
                                        {answers.filter(a => a.isCorrect).length}
                                    </ThemedText>
                                    <ThemedText variant="caption" color="textSecondary">
                                        Correct
                                    </ThemedText>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <ThemedText variant="h3" color="error">
                                        {answers.filter(a => !a.isCorrect).length}
                                    </ThemedText>
                                    <ThemedText variant="caption" color="textSecondary">
                                        Incorrect
                                    </ThemedText>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <ThemedText variant="h3" color="primary">
                                        {quiz.questions.length}
                                    </ThemedText>
                                    <ThemedText variant="caption" color="textSecondary">
                                        Total
                                    </ThemedText>
                                </View>
                            </View>
                        </View>

                        {/* Mode-specific messaging */}
                        {isPracticeMode && (
                            <View style={{
                                backgroundColor: theme.colors.info + '15',
                                padding: theme.spacing.md,
                                borderRadius: theme.borderRadius.md,
                                width: '100%',
                                marginBottom: theme.spacing.md,
                                borderLeftWidth: 4,
                                borderLeftColor: theme.colors.info
                            }}>
                                <ThemedText variant="body2" style={{ textAlign: 'center' }}>
                                    💡 This was practice mode - your score doesn't count toward completion.
                                    {score >= 70
                                        ? " You're ready to take the real test!"
                                        : " Keep practicing to improve!"}
                                </ThemedText>
                            </View>
                        )}

                        <ThemedButton
                            title={isPracticeMode ? "Continue" : "Continue Learning"}
                            onPress={handleQuizComplete}
                            style={{ width: '100%' }}
                        />
                    </View>
                </SafeAreaView>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: `${quiz.title} ${isPracticeMode ? '(Practice)' : ''}`,
                        headerStyle: {
                            backgroundColor: theme.colors.surface,
                        },
                        headerTintColor: theme.colors.text,
                        headerTitleStyle: {
                            fontWeight: '600',
                        },
                        headerLeft: () => (
                            <Pressable
                                onPress={handleExit}
                                style={{
                                    marginLeft: theme.spacing.sm,
                                    width: 40,
                                    height: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: theme.borderRadius.round,
                                }}
                            >
                                <Ionicons
                                    name="close"
                                    size={28}
                                    color={theme.colors.text}
                                />
                            </Pressable>
                        ),
                    }}
                />

                {/* Progress Header with Mode Badge */}
                <View
                    style={{
                        padding: theme.spacing.md,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface
                    }}
                >
                    {/* Mode Badge */}
                    {isPracticeMode && (
                        <View style={{
                            backgroundColor: theme.colors.info + '20',
                            paddingHorizontal: theme.spacing.sm,
                            paddingVertical: theme.spacing.xs,
                            borderRadius: theme.borderRadius.md,
                            alignSelf: 'center',
                            marginBottom: theme.spacing.sm
                        }}>
                            <ThemedText variant="caption" style={{
                                color: theme.colors.info,
                                fontWeight: '600'
                            }}>
                                🎯 PRACTICE MODE - No score tracking
                            </ThemedText>
                        </View>
                    )}

                    {/* Progress Bar */}
                    <View
                        style={{
                            height: 8,
                            backgroundColor: theme.colors.surfaceVariant,
                            borderRadius: theme.borderRadius.round,
                            marginBottom: theme.spacing.sm,
                            overflow: 'hidden'
                        }}
                    >
                        <View
                            style={{
                                height: '100%',
                                width: `${quizProgress}%`,
                                backgroundColor: isPracticeMode ? theme.colors.info : theme.colors.primary,
                                borderRadius: theme.borderRadius.round,
                            }}
                        />
                    </View>

                    {/* Question Counter */}
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <ThemedText variant="body2" color="textSecondary">
                            Question {currentQuestionIndex + 1} of {quiz.questions.length}
                        </ThemedText>
                        <ThemedText variant="body2" style={{
                            color: isPracticeMode ? theme.colors.info : theme.colors.primary,
                            fontWeight: '600'
                        }}>
                            {Math.round(quizProgress)}%
                        </ThemedText>
                    </View>
                </View>

                {/* Question Content */}
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <QuizQuestionComponent
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        showResult={showResult}
                        userAnswer={answers[currentQuestionIndex]?.userAnswer}
                        isPracticeMode={isPracticeMode}
                    />
                </ScrollView>

                {/* Navigation Footer */}
                <View
                    style={{
                        padding: theme.spacing.md,
                        borderTopWidth: 1,
                        borderTopColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface
                    }}
                >
                    <ThemedButton
                        title={currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                        onPress={handleNext}
                        disabled={!showResult}
                        variant="primary"
                    />
                </View>
            </SafeAreaView>
            <QuizExitModal
                visible={showExitModal}
                onConfirm={confirmExit}
                onCancel={cancelExit}
            />
        </ThemedView>
    );
}