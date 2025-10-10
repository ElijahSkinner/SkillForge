// components/QuizScreen.tsx - UPDATED WITH EXIT BUTTON AND COMPLETION TRACKING

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

export default function QuizScreen() {
    const { objective, quizType } = useLocalSearchParams<{
        objective: string;
        quizType: 'quizA' | 'quizB';
    }>();
    const { theme } = useTheme();
    const router = useRouter();
    const { progress: userProgress, addCompletedQuiz } = useAuth();
    const { selectedCert } = useCert();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ isCorrect: boolean; userAnswer: any }[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showExitModal, setShowExitModal] = useState(false);

    // Gather all domains into one lookup object
    const ALL_DOMAINS: Record<string, any> = {
        ...DOMAIN_1_QUIZZES,
        ...DOMAIN_2_QUIZZES,
    };

    const quiz = ALL_DOMAINS[objective!]?.[quizType!];

    // Handle exit with confirmation
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

    const handleAnswer = (isCorrect: boolean, userAnswer: any) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = { isCorrect, userAnswer };
        setAnswers(newAnswers);
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

        // Track quiz completion in database if passing score
        if (selectedCert && objective && quizType) {
            const [moduleId, lessonIndex] = objective.split('.').map(Number);

            try {
                await addCompletedQuiz(
                    selectedCert,
                    moduleId,
                    lessonIndex,
                    quizType,
                    score
                );

                console.log('✅ Quiz completion tracked successfully');
            } catch (error) {
                console.error('Failed to track quiz completion:', error);
            }
        }

        // Navigate back to roadmap
        router.back();
    };

    if (quizCompleted) {
        const score = calculateScore();
        const passed = score >= 70;

        return (
            <ThemedView style={{ flex: 1 }}>
                <Stack.Screen
                    options={{
                        headerShown: false
                    }}
                />
                <SafeAreaView style={{ flex: 1, padding: theme.spacing.lg }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {/* Success/Failure Icon */}
                        <View style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: passed ? theme.colors.success + '20' : theme.colors.warning + '20',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: theme.spacing.lg
                        }}>
                            <Ionicons
                                name={passed ? "checkmark-circle" : "alert-circle"}
                                size={60}
                                color={passed ? theme.colors.success : theme.colors.warning}
                            />
                        </View>

                        <ThemedText variant="h2" style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}>
                            {passed ? 'Quiz Complete!' : 'Keep Studying!'}
                        </ThemedText>

                        <ThemedText
                            variant="h3"
                            style={{
                                marginBottom: theme.spacing.lg,
                                color: passed ? theme.colors.success : theme.colors.warning,
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
                            {passed
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

                        <ThemedButton
                            title="Continue Learning"
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
                {/* Custom Header with Exit Button */}
                <Stack.Screen
                    options={{
                        headerShown: true,
                        headerTitle: quiz.title,
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

                {/* Progress Header */}
                <View
                    style={{
                        padding: theme.spacing.md,
                        borderBottomWidth: 1,
                        borderBottomColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface
                    }}
                >
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
                                backgroundColor: theme.colors.primary,
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
                        <ThemedText variant="body2" color="primary" style={{ fontWeight: '600' }}>
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

            {/* Themed Exit Confirmation Modal */}
            <QuizExitModal
                visible={showExitModal}
                onConfirm={confirmExit}
                onCancel={cancelExit}
            />
        </ThemedView>
    );
}