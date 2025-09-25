// components/(tabs)/glossary/Flashcards.tsx - Enhanced version
import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated, Dimensions } from 'react-native';
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

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Flashcards({ data, onClose }: Props) {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showDefinition, setShowDefinition] = useState(false);
    const flipAnimation = useRef(new Animated.Value(0)).current;

    if (!data || data.length === 0) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.emptyContainer}>
                    <Ionicons name="library-outline" size={64} color={theme.colors.textMuted} />
                    <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>
                        No flashcards available.
                    </Text>
                    {onClose && (
                        <Pressable
                            style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.closeButtonText, { color: theme.colors.textOnPrimary }]}>
                                Go Back
                            </Text>
                        </Pressable>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    const currentCard = data[currentIndex];

    const flipCard = () => {
        const toValue = showDefinition ? 0 : 1;

        Animated.spring(flipAnimation, {
            toValue,
            tension: 150,
            friction: 8,
            useNativeDriver: true,
        }).start(() => {
            setShowDefinition(!showDefinition);
        });
    };

    const nextCard = () => {
        if (currentIndex < data.length - 1) {
            setShowDefinition(false);
            flipAnimation.setValue(0);
            setCurrentIndex(prev => prev + 1);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setShowDefinition(false);
            flipAnimation.setValue(0);
            setCurrentIndex(prev => prev - 1);
        }
    };

    // Calculate card colors based on current theme
    const getCardColors = () => {
        const colorSets = [
            { front: theme.colors.primary, back: theme.colors.accent },
            { front: theme.colors.success, back: theme.colors.warning },
            { front: theme.colors.secondary, back: theme.colors.info },
        ];
        return colorSets[currentIndex % colorSets.length];
    };

    const cardColors = getCardColors();

    // Flip animation interpolations
    const frontAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                })
            }
        ]
    };

    const backAnimatedStyle = {
        transform: [
            {
                rotateY: flipAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['180deg', '360deg'],
                })
            }
        ]
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable
                    style={[styles.headerButton, { backgroundColor: theme.colors.surface }]}
                    onPress={onClose}
                >
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </Pressable>

                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    Flashcards
                </Text>

                <View style={styles.headerSpacer} />
            </View>

            {/* Progress bar */}
            <View style={[styles.progressContainer, { backgroundColor: theme.colors.surface }]}>
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

            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                {currentIndex + 1} of {data.length}
            </Text>

            {/* Flashcard container */}
            <View style={styles.flashcardContainer}>
                <Pressable onPress={flipCard} style={styles.cardPressable}>
                    {/* Front of card */}
                    <Animated.View
                        style={[
                            styles.flashcard,
                            { backgroundColor: cardColors.front },
                            frontAnimatedStyle,
                            showDefinition && styles.cardHidden
                        ]}
                    >
                        <View style={styles.cardContent}>
                            <Ionicons
                                name="help-circle-outline"
                                size={32}
                                color={theme.colors.textOnPrimary}
                                style={styles.cardIcon}
                            />
                            <Text style={[styles.cardText, { color: theme.colors.textOnPrimary }]}>
                                {currentCard.term || currentCard.acronym || currentCard.port}
                            </Text>
                            <Text style={[styles.tapHint, { color: theme.colors.textOnPrimary }]}>
                                Tap to reveal
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Back of card */}
                    <Animated.View
                        style={[
                            styles.flashcard,
                            styles.flashcardBack,
                            { backgroundColor: cardColors.back },
                            backAnimatedStyle,
                            !showDefinition && styles.cardHidden
                        ]}
                    >
                        <View style={styles.cardContent}>
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={32}
                                color={theme.colors.textOnPrimary}
                                style={styles.cardIcon}
                            />
                            <Text style={[styles.cardText, { color: theme.colors.textOnPrimary }]}>
                                {currentCard.definition}
                            </Text>
                            <Text style={[styles.tapHint, { color: theme.colors.textOnPrimary }]}>
                                Tap to flip back
                            </Text>
                        </View>
                    </Animated.View>
                </Pressable>
            </View>

            {/* Navigation buttons */}
            <View style={styles.navContainer}>
                <Pressable
                    style={[
                        styles.navButton,
                        { backgroundColor: theme.colors.secondary },
                        currentIndex === 0 && [styles.disabledButton, { backgroundColor: theme.colors.surface }]
                    ]}
                    onPress={prevCard}
                    disabled={currentIndex === 0}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={currentIndex === 0 ? theme.colors.textMuted : theme.colors.textOnPrimary}
                    />
                    <Text style={[
                        styles.navText,
                        { color: currentIndex === 0 ? theme.colors.textMuted : theme.colors.textOnPrimary }
                    ]}>
                        Previous
                    </Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.navButton,
                        { backgroundColor: theme.colors.secondary },
                        currentIndex === data.length - 1 && [styles.disabledButton, { backgroundColor: theme.colors.surface }]
                    ]}
                    onPress={nextCard}
                    disabled={currentIndex === data.length - 1}
                >
                    <Text style={[
                        styles.navText,
                        { color: currentIndex === data.length - 1 ? theme.colors.textMuted : theme.colors.textOnPrimary }
                    ]}>
                        Next
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={currentIndex === data.length - 1 ? theme.colors.textMuted : theme.colors.textOnPrimary}
                    />
                </Pressable>
            </View>

            {/* Study stats */}
            <View style={[styles.statsContainer, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.primary }]}>
                        {Math.round(((currentIndex + 1) / data.length) * 100)}%
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                        Progress
                    </Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: theme.colors.borderColor }]} />
                <View style={styles.statItem}>
                    <Text style={[styles.statNumber, { color: theme.colors.success }]}>
                        {data.length}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                        Total Cards
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = {
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
        fontSize: 18,
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingBottom: 8,
    },
    headerButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    headerSpacer: {
        width: 44,
    },
    progressContainer: {
        height: 4,
        marginHorizontal: 16,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    progressText: {
        textAlign: 'center',
        fontSize: 14,
        marginTop: 8,
        marginBottom: 16,
        fontWeight: '600',
    },
    flashcardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    cardPressable: {
        width: screenWidth - 48,
        height: Math.min(screenHeight * 0.5, 400),
    },
    flashcard: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        backfaceVisibility: 'hidden',
    },
    flashcardBack: {
        // Additional styles for back of card if needed
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    cardIcon: {
        marginBottom: 16,
        opacity: 0.8,
    },
    cardText: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 32,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tapHint: {
        fontSize: 14,
        opacity: 0.8,
        marginTop: 16,
        fontStyle: 'italic',
    },
    cardHidden: {
        opacity: 0,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 16,
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        gap: 8,
    },
    disabledButton: {
        opacity: 0.5,
    },
    navText: {
        fontSize: 16,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 12,
        padding: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
        textTransform: 'uppercase',
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        marginHorizontal: 16,
    },
    closeButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
} as const;