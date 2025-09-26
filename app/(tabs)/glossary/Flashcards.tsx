// app/(tabs)/glossary/Flashcards.tsx - Ultra-smooth, Duolingo-beating UI
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../context/ThemeContext';
import {
    ThemedView,
    ThemedText,
    ThemedButton
} from '../../../components/themed';
import { ThemedCard } from '../../../components/themed/ThemedCard';
import { ThemedBadge } from '../../../components/themed/ThemedBadge';
import { ThemedProgressBar } from '../../../components/themed/ThemedProgressBar';
import { ThemedIconButton } from '../../../components/themed/ThemedIconButton';

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

    // Empty state with beautiful design
    if (!data || data.length === 0) {
        return (
            <ThemedView variant="background" style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl }}>
                    <View style={{
                        width: 120, height: 120, borderRadius: 60,
                        backgroundColor: theme.colors.primary + '20',
                        justifyContent: 'center', alignItems: 'center',
                        marginBottom: theme.spacing.xl
                    }}>
                        <ThemedText variant="h1" style={{ color: theme.colors.primary, opacity: 0.6 }}>
                            📚
                        </ThemedText>
                    </View>
                    <ThemedText variant="h3" style={{ marginBottom: theme.spacing.sm, textAlign: 'center' }}>
                        No Flashcards Available
                    </ThemedText>
                    <ThemedText color="textSecondary" style={{ textAlign: 'center', lineHeight: 24 }}>
                        Try selecting a different objective or tab to start studying.
                    </ThemedText>
                </SafeAreaView>
            </ThemedView>
        );
    }

    const currentCard = data[currentIndex];
    const progress = ((currentIndex + 1) / data.length) * 100;

    const flipCard = () => setShowDefinition(!showDefinition);

    const nextCard = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowDefinition(false);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowDefinition(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Elegant Header */}
            <ThemedView variant="surface" style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: theme.spacing.md,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.borderColor + '40',
                ...theme.shadows.small
            }}>
                <ThemedIconButton
                    icon="close"
                    variant="ghost"
                    onPress={onClose}
                />
                <ThemedText variant="body1" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                    {currentIndex + 1} of {data.length}
                </ThemedText>
                <View style={{ width: 40 }} />
            </ThemedView>

            {/* Beautiful Progress Bar with Glow */}
            <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg }}>
                <ThemedProgressBar
                    progress={progress}
                    variant="default"
                    showGlow={true}
                    color="primary"
                />
            </View>

            {/* Stunning Flashcard */}
            <View style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: theme.spacing.lg,
                paddingVertical: theme.spacing.xl
            }}>
                <ThemedCard
                    variant={showDefinition ? 'flashcard-flipped' : 'flashcard'}
                    onPress={flipCard}
                    style={{
                        // Add subtle bounce animation feel
                        transform: [{ scale: 1 }],
                    }}
                >
                    {/* Badge */}
                    <ThemedBadge
                        text={showDefinition ? 'DEFINITION' : 'TERM'}
                        variant={showDefinition ? 'inverted' : 'primary'}
                        size="medium"
                    />

                    {/* Content */}
                    <ThemedText
                        variant="h2"
                        style={{
                            textAlign: 'center',
                            letterSpacing: -0.5,
                            lineHeight: 36,
                            color: showDefinition ? theme.colors.textOnPrimary : theme.colors.text,
                            paddingHorizontal: theme.spacing.sm,
                        }}
                    >
                        {showDefinition
                            ? currentCard.definition
                            : (currentCard.term || currentCard.acronym || currentCard.port)
                        }
                    </ThemedText>

                    {/* Hint */}
                    <ThemedText
                        variant="caption"
                        style={{
                            fontStyle: 'italic',
                            textAlign: 'center',
                            opacity: 0.8,
                            color: showDefinition ? theme.colors.textOnPrimary : theme.colors.textMuted
                        }}
                    >
                        {showDefinition ? '👆 Tap to flip back' : '👆 Tap to reveal definition'}
                    </ThemedText>
                </ThemedCard>
            </View>

            {/* Premium Navigation */}
            <View style={{
                flexDirection: 'row',
                paddingHorizontal: theme.spacing.lg,
                paddingBottom: theme.spacing.lg,
                gap: theme.spacing.md
            }}>
                <ThemedButton
                    title="← Previous"
                    variant="outline"
                    size="medium"
                    onPress={prevCard}
                    disabled={currentIndex === 0}
                    style={{ flex: 1 }}
                />

                <ThemedButton
                    title="Next →"
                    variant="primary"
                    size="medium"
                    onPress={nextCard}
                    disabled={currentIndex === data.length - 1}
                    style={{ flex: 1 }}
                />
            </View>
        </SafeAreaView>
    );
}