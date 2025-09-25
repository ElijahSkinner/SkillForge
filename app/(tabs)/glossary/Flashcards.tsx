// components/(tabs)/glossary/Flashcards.tsx - Clean, working version
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

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
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                        No flashcards available.
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    const currentCard = data[currentIndex];

    const flipCard = () => {
        setShowDefinition(!showDefinition);
    };

    const nextCard = () => {
        if (currentIndex < data.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setShowDefinition(false); // Reset to front side
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setShowDefinition(false); // Reset to front side
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.colors.borderColor }]}>
                <Pressable style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </Pressable>

                <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                    {currentIndex + 1} of {data.length}
                </Text>

                <View style={{ width: 32 }} />
            </View>

            {/* Progress bar */}
            <View style={[styles.progressContainer, { backgroundColor: theme.colors.borderColor }]}>
                <View
                    style={[
                        styles.progressBar,
                        {
                            backgroundColor: theme.colors.primary,
                            width: `${((currentIndex + 1) / data.length) * 100}%`
                        }
                    ]}
                />
            </View>

            {/* Card */}
            <View style={styles.cardContainer}>
                <Pressable onPress={flipCard} style={[
                    styles.card,
                    {
                        backgroundColor: showDefinition ? theme.colors.primary : theme.colors.surface,
                        borderColor: theme.colors.borderColor
                    }
                ]}>
                    {!showDefinition ? (
                        // Front side - Term
                        <>
                            <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                                <Text style={[styles.badgeText, { color: theme.colors.textOnPrimary }]}>
                                    TERM
                                </Text>
                            </View>
                            <Text style={[styles.cardTerm, { color: theme.colors.text }]}>
                                {currentCard.term || currentCard.acronym || currentCard.port}
                            </Text>
                            <Text style={[styles.hint, { color: theme.colors.textMuted }]}>
                                Tap to reveal definition
                            </Text>
                        </>
                    ) : (
                        // Back side - Definition
                        <>
                            <View style={[styles.badge, { backgroundColor: theme.colors.textOnPrimary }]}>
                                <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
                                    DEFINITION
                                </Text>
                            </View>
                            <Text style={[styles.cardDefinition, { color: theme.colors.textOnPrimary }]}>
                                {currentCard.definition}
                            </Text>
                            <Text style={[styles.hint, { color: theme.colors.textOnPrimary, opacity: 0.8 }]}>
                                Tap to flip back
                            </Text>
                        </>
                    )}
                </Pressable>
            </View>

            {/* Navigation */}
            <View style={styles.navContainer}>
                <Pressable
                    style={[
                        styles.navButton,
                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor },
                        currentIndex === 0 && { opacity: 0.5 }
                    ]}
                    onPress={prevCard}
                    disabled={currentIndex === 0}
                >
                    <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
                    <Text style={[styles.navButtonText, { color: theme.colors.text }]}>Previous</Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.navButton,
                        { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor },
                        currentIndex === data.length - 1 && { opacity: 0.5 }
                    ]}
                    onPress={nextCard}
                    disabled={currentIndex === data.length - 1}
                >
                    <Text style={[styles.navButtonText, { color: theme.colors.text }]}>Next</Text>
                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 4,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '500',
    },
    progressContainer: {
        height: 3,
        marginHorizontal: 20,
        borderRadius: 1.5,
        marginVertical: 20,
    },
    progressBar: {
        height: '100%',
        borderRadius: 1.5,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    card: {
        height: 350,
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cardTerm: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    cardDefinition: {
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: 26,
    },
    hint: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    navContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingBottom: 20,
        gap: 12,
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
});