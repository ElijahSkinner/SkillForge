// app/(tabs)/glossary/Flashcards.tsx - Simplified with theme integration (Under 100 lines)
import React, { useState } from 'react';
import { View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { ThemedView, ThemedText } from '../../../components/themed';

type FlashcardItem = {
    term?: string;
    acronym?: string;
    port?: string;
    definition: string;
};

type Props = {
    data: FlashcardItem[];
    onClose?: () => void;
};

export default function Flashcards({ data, onClose }: Props) {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);

    if (!data || data.length === 0) {
        return (
            <ThemedView variant="background" style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl }}>
                <Ionicons name="library-outline" size={64} color={theme.colors.textMuted} style={{ marginBottom: theme.spacing.lg, opacity: 0.5 }} />
                <ThemedText color="textSecondary" style={{ textAlign: 'center', lineHeight: 24 }}>
                    No flashcards available for this topic.{'\n\n'}Try selecting a different objective or tab.
                </ThemedText>
            </ThemedView>
        );
    }

    const currentCard = data[currentIndex];
    const progress = ((currentIndex + 1) / data.length) * 100;
    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < data.length - 1;

    const flipCard = () => setShowDefinition(!showDefinition);

    const nextCard = () => {
        if (canGoNext) {
            setCurrentIndex(currentIndex + 1);
            setShowDefinition(false);
        }
    };

    const prevCard = () => {
        if (canGoPrevious) {
            setCurrentIndex(currentIndex - 1);
            setShowDefinition(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header */}
            <ThemedView variant="surface" style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.borderColor,
                ...theme.shadows.small
            }}>
                <Pressable
                    onPress={onClose}
                    style={{
                        width: 40, height: 40, borderRadius: 20,
                        justifyContent: 'center', alignItems: 'center',
                        backgroundColor: theme.colors.surfaceVariant
                    }}
                >
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </Pressable>
                <ThemedText variant="body1" style={{ fontWeight: '600' }}>
                    {currentIndex + 1} of {data.length}
                </ThemedText>
                <View style={{ width: 40 }} />
            </ThemedView>

            {/* Progress Bar */}
            <View style={{
                height: 4, marginHorizontal: theme.spacing.lg, marginVertical: theme.spacing.md,
                backgroundColor: theme.colors.surfaceVariant, borderRadius: theme.borderRadius.sm
            }}>
                <View style={{
                    height: '100%', width: `${progress}%`,
                    backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.sm
                }} />
            </View>

            {/* Card */}
            <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xxl }}>
                <Pressable
                    onPress={flipCard}
                    style={{
                        height: 350, borderRadius: theme.borderRadius.xl, borderWidth: 2,
                        padding: theme.spacing.xl, justifyContent: 'space-between', alignItems: 'center',
                        backgroundColor: showDefinition ? theme.colors.primary : theme.colors.surface,
                        borderColor: showDefinition ? theme.colors.primary : theme.colors.borderColor,
                        ...theme.shadows.large
                    }}
                >
                    {/* Badge */}
                    <View style={{
                        paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs,
                        borderRadius: theme.borderRadius.round,
                        backgroundColor: showDefinition ? theme.colors.textOnPrimary : theme.colors.primary
                    }}>
                        <ThemedText
                            style={{
                                ...theme.typography.overline,
                                fontWeight: '800', letterSpacing: 1,
                                color: showDefinition ? theme.colors.primary : theme.colors.textOnPrimary
                            }}
                        >
                            {showDefinition ? 'DEFINITION' : 'TERM'}
                        </ThemedText>
                    </View>

                    {/* Content */}
                    <ThemedText style={{
                        ...theme.typography.h2, textAlign: 'center', letterSpacing: -0.5,
                        color: showDefinition ? theme.colors.textOnPrimary : theme.colors.text
                    }}>
                        {showDefinition ? currentCard.definition : (currentCard.term || currentCard.acronym || currentCard.port)}
                    </ThemedText>

                    {/* Hint */}
                    <ThemedText style={{
                        ...theme.typography.caption, fontStyle: 'italic', textAlign: 'center', opacity: 0.8,
                        color: showDefinition ? theme.colors.textOnPrimary : theme.colors.textMuted
                    }}>
                        {showDefinition ? 'Tap to flip back' : 'Tap to reveal definition'}
                    </ThemedText>
                </Pressable>
            </View>

            {/* Navigation */}
            <View style={{ flexDirection: 'row', paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg, gap: theme.spacing.sm }}>
                <Pressable
                    onPress={prevCard}
                    disabled={!canGoPrevious}
                    style={{
                        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.md, borderWidth: 1,
                        backgroundColor: canGoPrevious ? theme.colors.surface : theme.colors.surfaceVariant,
                        borderColor: theme.colors.borderColor,
                        opacity: canGoPrevious ? 1 : 0.5,
                        gap: theme.spacing.xs,
                        ...theme.shadows.small
                    }}
                >
                    <Ionicons name="chevron-back" size={20} color={canGoPrevious ? theme.colors.text : theme.colors.textMuted} />
                    <ThemedText style={{ fontWeight: '600', color: canGoPrevious ? theme.colors.text : theme.colors.textMuted }}>
                        Previous
                    </ThemedText>
                </Pressable>

                <Pressable
                    onPress={nextCard}
                    disabled={!canGoNext}
                    style={{
                        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                        paddingVertical: theme.spacing.sm, borderRadius: theme.borderRadius.md, borderWidth: 1,
                        backgroundColor: canGoNext ? theme.colors.surface : theme.colors.surfaceVariant,
                        borderColor: theme.colors.borderColor,
                        opacity: canGoNext ? 1 : 0.5,
                        gap: theme.spacing.xs,
                        ...theme.shadows.small
                    }}
                >
                    <ThemedText style={{ fontWeight: '600', color: canGoNext ? theme.colors.text : theme.colors.textMuted }}>
                        Next
                    </ThemedText>
                    <Ionicons name="chevron-forward" size={20} color={canGoNext ? theme.colors.text : theme.colors.textMuted} />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}