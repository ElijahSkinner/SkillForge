// app/(tabs)/glossary/Flashcards.tsx - Enhanced with theme integration
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

// Create themed styles
const createStyles = (theme: any) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: theme.spacing.xxl,
    },

    emptyIcon: {
        marginBottom: theme.spacing.lg,
        opacity: 0.5,
    },

    emptyText: {
        ...theme.typography.body1,
        color: theme.colors.textMuted,
        textAlign: 'center' as const,
        lineHeight: 24,
    },

    // Header Styles
    header: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderColor,
        backgroundColor: theme.colors.surface,
        ...theme.shadows.small,
    },

    closeButton: {
        width: 40,
        height: 40,
        borderRadius: theme.borderRadius.round,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        backgroundColor: theme.colors.surfaceVariant,
    },

    progressText: {
        ...theme.typography.body1,
        fontWeight: '600',
        color: theme.colors.text,
    },

    // Progress Bar
    progressContainer: {
        height: 4,
        marginHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.sm,
        marginVertical: theme.spacing.md,
        backgroundColor: theme.colors.surfaceVariant,
        overflow: 'hidden' as const,
    },

    progressBar: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.sm,
        minWidth: 4, // Ensure it's visible even at 0%
        ...theme.shadows.small,
    },

    // Card Container
    cardContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },

    // Flashcard Styles
    card: {
        height: 350,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 2,
        padding: theme.spacing.xl,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        ...theme.shadows.large,
        // Add subtle animation feel
        transform: [{ scale: 1 }],
    },

    cardFront: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderColor,
    },

    cardBack: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },

    // Badge Styles
    badge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.round,
    },

    badgeFront: {
        backgroundColor: theme.colors.primary,
    },

    badgeBack: {
        backgroundColor: theme.colors.textOnPrimary,
    },

    badgeText: {
        ...theme.typography.overline,
        fontWeight: '800',
        letterSpacing: 1,
    },

    badgeTextFront: {
        color: theme.colors.textOnPrimary,
    },

    badgeTextBack: {
        color: theme.colors.primary,
    },

    // Card Content
    cardTerm: {
        ...theme.typography.h2,
        textAlign: 'center' as const,
        letterSpacing: -0.5,
        lineHeight: 36,
    },

    cardTermFront: {
        color: theme.colors.text,
    },

    cardTermBack: {
        color: theme.colors.textOnPrimary,
    },

    cardDefinition: {
        ...theme.typography.body1,
        textAlign: 'center' as const,
        lineHeight: 24,
        paddingHorizontal: theme.spacing.sm,
    },

    cardDefinitionText: {
        color: theme.colors.textOnPrimary,
    },

    hint: {
        ...theme.typography.caption,
        fontStyle: 'italic',
        textAlign: 'center' as const,
        opacity: 0.8,
    },

    hintFront: {
        color: theme.colors.textMuted,
    },

    hintBack: {
        color: theme.colors.textOnPrimary,
    },

    // Navigation Styles
    navContainer: {
        flexDirection: 'row' as const,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.background,
    },

    navButton: {
        flex: 1,
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        gap: theme.spacing.xs,
        ...theme.shadows.small,
    },

    navButtonEnabled: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.borderColor,
    },

    navButtonDisabled: {
        backgroundColor: theme.colors.surfaceVariant,
        borderColor: theme.colors.borderColor,
        opacity: 0.5,
    },

    navButtonText: {
        ...theme.typography.body2,
        fontWeight: '600',
    },

    navButtonTextEnabled: {
        color: theme.colors.text,
    },

    navButtonTextDisabled: {
        color: theme.colors.textMuted,
    },
});

export default function Flashcards({ data, onClose }: Props) {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);

    const styles = createStyles(theme);

    if (!data || data.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="library-outline"
                        size={64}
                        color={theme.colors.textMuted}
                        style={styles.emptyIcon}
                    />
                    <ThemedText style={styles.emptyText}>
                        No flashcards available for this topic.
                        {'\n\n'}Try selecting a different objective or tab.
                    </ThemedText>
                </View>
            </SafeAreaView>
        );
    }

    const currentCard = data[currentIndex];
    const progress = ((currentIndex + 1) / data.length) * 100;

    const flipCard = () => {
        setShowDefinition(!showDefinition);
    };

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

    const canGoPrevious = currentIndex > 0;
    const canGoNext = currentIndex < data.length - 1;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header with enhanced styling */}
            <View style={styles.header}>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </Pressable>

                <ThemedText style={styles.progressText}>
                    {currentIndex + 1} of {data.length}
                </ThemedText>

                <View style={{ width: 40 }} />
            </View>

            {/* Enhanced Progress bar */}
            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressBar,
                        { width: `${progress}%` }
                    ]}
                />
            </View>

            {/* Card with improved styling */}
            <View style={styles.cardContainer}>
                <Pressable
                    onPress={flipCard}
                    style={[
                        styles.card,
                        showDefinition ? styles.cardBack : styles.cardFront,
                    ]}
                >
                    {!showDefinition ? (
                        // Front side - Term
                        <>
                            <View style={[
                                styles.badge,
                                styles.badgeFront,
                            ]}>
                                <ThemedText style={[
                                    styles.badgeText,
                                    styles.badgeTextFront,
                                ]}>
                                    TERM
                                </ThemedText>
                            </View>

                            <ThemedText style={[
                                styles.cardTerm,
                                styles.cardTermFront,
                            ]}>
                                {currentCard.term || currentCard.acronym || currentCard.port}
                            </ThemedText>

                            <ThemedText style={[
                                styles.hint,
                                styles.hintFront,
                            ]}>
                                Tap to reveal definition
                            </ThemedText>
                        </>
                    ) : (
                        // Back side - Definition
                        <>
                            <View style={[
                                styles.badge,
                                styles.badgeBack,
                            ]}>
                                <ThemedText style={[
                                    styles.badgeText,
                                    styles.badgeTextBack,
                                ]}>
                                    DEFINITION
                                </ThemedText>
                            </View>

                            <View style={styles.cardDefinition}>
                                <ThemedText style={styles.cardDefinitionText}>
                                    {currentCard.definition}
                                </ThemedText>
                            </View>

                            <ThemedText style={[
                                styles.hint,
                                styles.hintBack,
                            ]}>
                                Tap to flip back
                            </ThemedText>
                        </>
                    )}
                </Pressable>
            </View>

            {/* Enhanced Navigation */}
            <View style={styles.navContainer}>
                <Pressable
                    style={[
                        styles.navButton,
                        canGoPrevious ? styles.navButtonEnabled : styles.navButtonDisabled,
                    ]}
                    onPress={prevCard}
                    disabled={!canGoPrevious}
                >
                    <Ionicons
                        name="chevron-back"
                        size={20}
                        color={canGoPrevious ? theme.colors.text : theme.colors.textMuted}
                    />
                    <ThemedText style={[
                        styles.navButtonText,
                        canGoPrevious ? styles.navButtonTextEnabled : styles.navButtonTextDisabled,
                    ]}>
                        Previous
                    </ThemedText>
                </Pressable>

                <Pressable
                    style={[
                        styles.navButton,
                        canGoNext ? styles.navButtonEnabled : styles.navButtonDisabled,
                    ]}
                    onPress={nextCard}
                    disabled={!canGoNext}
                >
                    <ThemedText style={[
                        styles.navButtonText,
                        canGoNext ? styles.navButtonTextEnabled : styles.navButtonTextDisabled,
                    ]}>
                        Next
                    </ThemedText>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={canGoNext ? theme.colors.text : theme.colors.textMuted}
                    />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}