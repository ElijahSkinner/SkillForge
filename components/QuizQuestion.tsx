// components/quiz/QuizQuestion.tsx - NEW FILE
import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { QuizQuestion } from '@/types/quiz';
import { ThemedText, ThemedView } from '@/components/themed';
import { useTheme } from '@/context/ThemeContext';

interface Props {
    question: QuizQuestion;
    onAnswer: (isCorrect: boolean, userAnswer: any) => void;
    showResult?: boolean;
    userAnswer?: any;
}

export default function QuizQuestionComponent({ question, onAnswer, showResult, userAnswer }: Props) {
    const { theme } = useTheme();
    const [selectedAnswer, setSelectedAnswer] = useState<any>(null);

    const handleAnswer = (answer: any) => {
        setSelectedAnswer(answer);
        const isCorrect = checkAnswer(answer);
        onAnswer(isCorrect, answer);
    };

    const checkAnswer = (answer: any): boolean => {
        switch (question.type) {
            case 'multiple-choice':
            case 'scenario':
                return answer === question.correct;
            case 'true-false':
                return answer === question.correct;
            case 'fill-blank':
                if (Array.isArray(question.correct)) {
                    return question.correct.some(correctAnswer =>
                        answer.toLowerCase().trim() === correctAnswer.toLowerCase()
                    );
                }
                return answer.toLowerCase().trim() === (question.correct as string).toLowerCase();
            default:
                return false;
        }
    };

    const renderMultipleChoice = () => (
        <View>
            <ThemedText variant="body1" style={{ marginBottom: theme.spacing.md }}>
                {question.question}
            </ThemedText>
            {question.options?.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correct;
                const showCorrectAnswer = showResult && isCorrect;
                const showWrongAnswer = showResult && isSelected && !isCorrect;

                return (
                    <Pressable
                        key={index}
                        style={{
                            padding: theme.spacing.md,
                            marginBottom: theme.spacing.sm,
                            borderRadius: theme.borderRadius.md,
                            backgroundColor: showCorrectAnswer
                                ? theme.colors.success + '30'
                                : showWrongAnswer
                                    ? theme.colors.error + '30'
                                    : isSelected
                                        ? theme.colors.primary + '30'
                                        : theme.colors.surface,
                            borderWidth: 1,
                            borderColor: showCorrectAnswer
                                ? theme.colors.success
                                : showWrongAnswer
                                    ? theme.colors.error
                                    : isSelected
                                        ? theme.colors.primary
                                        : theme.colors.borderColor
                        }}
                        onPress={() => !showResult && handleAnswer(index)}
                        disabled={showResult}
                    >
                        <ThemedText variant="body1">{option}</ThemedText>
                    </Pressable>
                );
            })}
        </View>
    );

    const renderTrueFalse = () => (
        <View>
            <ThemedText variant="body1" style={{ marginBottom: theme.spacing.md }}>
                {question.question}
            </ThemedText>
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                {[true, false].map((value) => {
                    const isSelected = selectedAnswer === value;
                    const isCorrect = value === question.correct;
                    const showCorrectAnswer = showResult && isCorrect;
                    const showWrongAnswer = showResult && isSelected && !isCorrect;

                    return (
                        <Pressable
                            key={value.toString()}
                            style={{
                                flex: 1,
                                padding: theme.spacing.md,
                                borderRadius: theme.borderRadius.md,
                                backgroundColor: showCorrectAnswer
                                    ? theme.colors.success + '30'
                                    : showWrongAnswer
                                        ? theme.colors.error + '30'
                                        : isSelected
                                            ? theme.colors.primary + '30'
                                            : theme.colors.surface,
                                borderWidth: 1,
                                borderColor: showCorrectAnswer
                                    ? theme.colors.success
                                    : showWrongAnswer
                                        ? theme.colors.error
                                        : isSelected
                                            ? theme.colors.primary
                                            : theme.colors.borderColor,
                                alignItems: 'center'
                            }}
                            onPress={() => !showResult && handleAnswer(value)}
                            disabled={showResult}
                        >
                            <ThemedText variant="body1">
                                {value ? 'True' : 'False'}
                            </ThemedText>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );

    const renderFillBlank = () => {
        const [textInput, setTextInput] = useState('');

        return (
            <View>
                <ThemedText variant="body1" style={{ marginBottom: theme.spacing.md }}>
                    {question.question}
                </ThemedText>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing.md
                    }}
                >
                    <ThemedText
                        variant="body1"
                        style={{ minHeight: 20 }}
                        onPress={() => {
                            // For now, show a simple text input simulation
                            // In a real implementation, you'd use TextInput
                            const answer = prompt('Enter your answer:');
                            if (answer) {
                                setTextInput(answer);
                                handleAnswer(answer);
                            }
                        }}
                    >
                        {textInput || 'Tap to enter answer...'}
                    </ThemedText>
                </View>
            </View>
        );
    };

    return (
        <ThemedView style={{ padding: theme.spacing.md }}>
            {question.type === 'multiple-choice' || question.type === 'scenario' ? renderMultipleChoice() :
                question.type === 'true-false' ? renderTrueFalse() :
                    question.type === 'fill-blank' ? renderFillBlank() :
                        renderMultipleChoice()}

            {showResult && (
                <View style={{
                    marginTop: theme.spacing.md,
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.info + '20',
                    borderRadius: theme.borderRadius.md
                }}>
                    <ThemedText variant="body2" style={{ color: theme.colors.info }}>
                        {question.explanation}
                    </ThemedText>
                </View>
            )}
        </ThemedView>
    );
}