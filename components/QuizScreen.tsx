// components/quiz/QuizScreen.tsx - NEW FILE
console.log('QuizScreen.tsx file is being loaded');

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView, ThemedText, ThemedButton } from '@/components/themed';
import { useTheme } from '@/context/ThemeContext';
import { DOMAIN_1_QUIZZES } from '@/constants/quizData';
import QuizQuestionComponent from './QuizQuestion';

export default function QuizScreen() {
    const { objective, quizType } = useLocalSearchParams<{ objective: string; quizType: 'quizA' | 'quizB' }>();
    const { theme } = useTheme();
    const router = useRouter();
    console.log('QuizScreen params:', { objective, quizType });
    console.log('Available quizzes:', Object.keys(DOMAIN_1_QUIZZES));
    console.log('Quiz data:', DOMAIN_1_QUIZZES[objective!]?.[quizType!]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ isCorrect: boolean; userAnswer: any }[]>([]);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const quiz = DOMAIN_1_QUIZZES[objective!]?.[quizType!];

    if (!quiz) {
        return (
            <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Quiz not found</ThemedText>
            </ThemedView>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

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

    if (quizCompleted) {
        const score = calculateScore();
        return (
            <ThemedView style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, padding: theme.spacing.lg }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ThemedText variant="h2" style={{ marginBottom: theme.spacing.lg }}>
                            Quiz Complete!
                        </ThemedText>
                        <ThemedText variant="h3" style={{
                            marginBottom: theme.spacing.lg,
                            color: score >= 70 ? theme.colors.success : theme.colors.warning
                        }}>
                            Your Score: {score}%
                        </ThemedText>
                        <ThemedText variant="body1" style={{
                            textAlign: 'center',
                            marginBottom: theme.spacing.xl
                        }}>
                            {score >= 70 ?
                                "Great job! You've mastered this topic." :
                                "Keep studying! Review the material and try again."
                            }
                        </ThemedText>
                        <ThemedButton
                            title="Continue Learning"
                            onPress={() => router.back()}
                        />
                    </View>
                </SafeAreaView>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                {/* Header */}
                <View style={{
                    padding: theme.spacing.md,
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.borderColor
                }}>
                    <ThemedText variant="h4">{quiz.title}</ThemedText>
                    <View style={{
                        height: 4,
                        backgroundColor: theme.colors.borderColor,
                        borderRadius: 2,
                        marginTop: theme.spacing.sm
                    }}>
                        <View style={{
                            height: '100%',
                            width: `${progress}%`,
                            backgroundColor: theme.colors.primary,
                            borderRadius: 2
                        }} />
                    </View>
                    <ThemedText variant="caption" style={{ marginTop: theme.spacing.xs }}>
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </ThemedText>
                </View>

                {/* Question */}
                <ScrollView style={{ flex: 1 }}>
                    <QuizQuestionComponent
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                        showResult={showResult}
                        userAnswer={answers[currentQuestionIndex]?.userAnswer}
                    />
                </ScrollView>

                {/* Navigation */}
                <View style={{
                    padding: theme.spacing.md,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.borderColor
                }}>
                    <ThemedButton
                        title={currentQuestionIndex === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
                        onPress={handleNext}
                        disabled={!showResult}
                    />
                </View>
            </SafeAreaView>
        </ThemedView>
    );
}