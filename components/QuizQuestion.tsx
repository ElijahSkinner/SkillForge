// components/quiz/QuizQuestion.tsx
import React, { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { ThemedText, ThemedButton } from '@/components/themed';
import { useTheme } from '@/context/ThemeContext';
import { QuizQuestion } from '@/constants/quizData';

interface QuizQuestionComponentProps {
    question: QuizQuestion;
    onAnswer: (isCorrect: boolean, userAnswer: any) => void;
    showResult: boolean;
    userAnswer?: any;
}

export default function QuizQuestionComponent({
                                                  question,
                                                  onAnswer,
                                                  showResult,
                                                  userAnswer
                                              }: QuizQuestionComponentProps) {
    const { theme } = useTheme();
    const [selectedOption, setSelectedOption] = useState<number | string | null>(null);
    const [textAnswer, setTextAnswer] = useState('');
    const [draggedItems, setDraggedItems] = useState<Record<string, string>>({});

    const handleSubmit = () => {
        let isCorrect = false;
        let answer: any = null;

        switch (question.type) {
            case 'multiple-choice':
            case 'scenario':
                isCorrect = selectedOption === question.correct;
                answer = selectedOption;
                break;
            case 'true-false':
                isCorrect = (selectedOption === 1) === question.correct;
                answer = selectedOption === 1;
                break;
            case 'fill-blank':
                const normalizedAnswer = textAnswer.toLowerCase().trim();
                isCorrect = question.correct.some(
                    correct => correct.toLowerCase() === normalizedAnswer
                );
                answer = textAnswer;
                break;
            case 'drag-drop':
                isCorrect = question.targets.every(
                    target => draggedItems[target.id] === target.correct
                );
                answer = draggedItems;
                break;
        }

        onAnswer(isCorrect, answer);
    };

    const renderMultipleChoice = () => {
        const q = question as Extract<QuizQuestion, { type: 'multiple-choice' | 'scenario' }>;
        return (
            <View>
                {q.options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrect = index === q.correct;
                    const showCorrect = showResult && isCorrect;
                    const showIncorrect = showResult && isSelected && !isCorrect;

                    return (
                        <Pressable
                            key={index}
                            onPress={() => !showResult && setSelectedOption(index)}
                            style={{
                                padding: theme.spacing.md,
                                marginBottom: theme.spacing.sm,
                                borderRadius: theme.borderRadius.md,
                                borderWidth: 2,
                                borderColor: showCorrect
                                    ? theme.colors.success
                                    : showIncorrect
                                        ? theme.colors.error
                                        : isSelected
                                            ? theme.colors.primary
                                            : theme.colors.borderColor,
                                backgroundColor: showCorrect
                                    ? `${theme.colors.success}20`
                                    : showIncorrect
                                        ? `${theme.colors.error}20`
                                        : isSelected
                                            ? `${theme.colors.primary}10`
                                            : theme.colors.surface
                            }}
                        >
                            <ThemedText>{option}</ThemedText>
                        </Pressable>
                    );
                })}
            </View>
        );
    };

    const renderTrueFalse = () => {
        const q = question as Extract<QuizQuestion, { type: 'true-false' }>;
        const options = ['False', 'True'];

        return (
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                {options.map((option, index) => {
                    const isSelected = selectedOption === index;
                    const isCorrect = (index === 1) === q.correct;
                    const showCorrect = showResult && isCorrect;
                    const showIncorrect = showResult && isSelected && !isCorrect;

                    return (
                        <Pressable
                            key={index}
                            onPress={() => !showResult && setSelectedOption(index)}
                            style={{
                                flex: 1,
                                padding: theme.spacing.md,
                                borderRadius: theme.borderRadius.md,
                                borderWidth: 2,
                                borderColor: showCorrect
                                    ? theme.colors.success
                                    : showIncorrect
                                        ? theme.colors.error
                                        : isSelected
                                            ? theme.colors.primary
                                            : theme.colors.borderColor,
                                backgroundColor: showCorrect
                                    ? `${theme.colors.success}20`
                                    : showIncorrect
                                        ? `${theme.colors.error}20`
                                        : isSelected
                                            ? `${theme.colors.primary}10`
                                            : theme.colors.surface,
                                alignItems: 'center'
                            }}
                        >
                            <ThemedText variant="h4">{option}</ThemedText>
                        </Pressable>
                    );
                })}
            </View>
        );
    };

    const renderFillBlank = () => {
        const q = question as Extract<QuizQuestion, { type: 'fill-blank' }>;
        const isCorrect = showResult && q.correct.some(
            correct => correct.toLowerCase() === textAnswer.toLowerCase().trim()
        );

        return (
            <View>
                <TextInput
                    value={textAnswer}
                    onChangeText={setTextAnswer}
                    style={{
                        borderWidth: 2,
                        borderColor: showResult
                            ? isCorrect
                                ? theme.colors.success
                                : theme.colors.error
                            : theme.colors.borderColor,
                        borderRadius: theme.borderRadius.md,
                        padding: theme.spacing.md,
                        fontSize: 16,
                        color: theme.colors.text,
                        backgroundColor: theme.colors.surface
                    }}
                    placeholder="Type your answer..."
                    placeholderTextColor={theme.colors.textSecondary}
                    editable={!showResult}
                />
                {showResult && (
                    <ThemedText
                        variant="caption"
                        style={{
                            marginTop: theme.spacing.sm,
                            color: isCorrect ? theme.colors.success : theme.colors.error
                        }}
                    >
                        Correct answer(s): {q.correct.join(', ')}
                    </ThemedText>
                )}
            </View>
        );
    };

    const renderDragDrop = () => {
        const q = question as Extract<QuizQuestion, { type: 'drag-drop' }>;

        // Simplified drag-drop implementation
        return (
            <View>
                <ThemedText variant="caption" style={{ marginBottom: theme.spacing.md }}>
                    Tap an item, then tap a target to match them
                </ThemedText>

                <View style={{ marginBottom: theme.spacing.lg }}>
                    <ThemedText variant="h4" style={{ marginBottom: theme.spacing.sm }}>Items:</ThemedText>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
                        {q.items.map(item => (
                            <Pressable
                                key={item.id}
                                onPress={() => !showResult && setSelectedOption(item.id)}
                                style={{
                                    padding: theme.spacing.sm,
                                    backgroundColor: selectedOption === item.id
                                        ? theme.colors.primary
                                        : theme.colors.surface,
                                    borderRadius: theme.borderRadius.sm,
                                    borderWidth: 1,
                                    borderColor: theme.colors.borderColor
                                }}
                            >
                                <ThemedText style={{
                                    color: selectedOption === item.id
                                        ? theme.colors.textOnPrimary
                                        : theme.colors.text
                                }}>
                                    {item.text}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View>
                    <ThemedText variant="h4" style={{ marginBottom: theme.spacing.sm }}>Targets:</ThemedText>
                    {q.targets.map(target => {
                        const matchedItem = draggedItems[target.id];
                        const isCorrect = showResult && matchedItem === target.correct;
                        const isIncorrect = showResult && matchedItem && matchedItem !== target.correct;

                        return (
                            <Pressable
                                key={target.id}
                                onPress={() => {
                                    if (!showResult && selectedOption) {
                                        setDraggedItems(prev => ({
                                            ...prev,
                                            [target.id]: selectedOption as string
                                        }));
                                        setSelectedOption(null);
                                    }
                                }}
                                style={{
                                    padding: theme.spacing.md,
                                    marginBottom: theme.spacing.sm,
                                    borderRadius: theme.borderRadius.md,
                                    borderWidth: 2,
                                    borderColor: isCorrect
                                        ? theme.colors.success
                                        : isIncorrect
                                            ? theme.colors.error
                                            : theme.colors.borderColor,
                                    backgroundColor: isCorrect
                                        ? `${theme.colors.success}20`
                                        : isIncorrect
                                            ? `${theme.colors.error}20`
                                            : theme.colors.surface
                                }}
                            >
                                <ThemedText>{target.text}</ThemedText>
                                {matchedItem && (
                                    <ThemedText variant="caption" style={{
                                        marginTop: theme.spacing.xs,
                                        color: theme.colors.primary
                                    }}>
                                        → {q.items.find(i => i.id === matchedItem)?.text}
                                    </ThemedText>
                                )}
                            </Pressable>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View style={{ padding: theme.spacing.md }}>
            <ThemedText variant="h4" style={{ marginBottom: theme.spacing.lg }}>
                {question.question}
            </ThemedText>

            {question.type === 'multiple-choice' && renderMultipleChoice()}
            {question.type === 'scenario' && renderMultipleChoice()}
            {question.type === 'true-false' && renderTrueFalse()}
            {question.type === 'fill-blank' && renderFillBlank()}
            {question.type === 'drag-drop' && renderDragDrop()}

            {!showResult && (
                <ThemedButton
                    title="Submit Answer"
                    onPress={handleSubmit}
                    disabled={
                        (question.type === 'multiple-choice' || question.type === 'scenario' || question.type === 'true-false') && selectedOption === null ||
                        question.type === 'fill-blank' && !textAnswer.trim() ||
                        question.type === 'drag-drop' && Object.keys(draggedItems).length === 0
                    }
                    style={{ marginTop: theme.spacing.lg }}
                />
            )}

            {showResult && (
                <View style={{
                    padding: theme.spacing.md,
                    marginTop: theme.spacing.lg,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: `${theme.colors.info}10`,
                    borderWidth: 1,
                    borderColor: theme.colors.info
                }}>
                    <ThemedText variant="h4" style={{ marginBottom: theme.spacing.sm }}>
                        Explanation:
                    </ThemedText>
                    <ThemedText>{question.explanation}</ThemedText>
                </View>
            )}
        </View>
    );
}