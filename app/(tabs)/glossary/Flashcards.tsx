// components/(tabs)/glossary/Flashcards.tsx - Professional version
import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Animated, Dimensions, PanResponder } from 'react-native';
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

const { width: screenWidth } = Dimensions.get('window');

export default function Flashcards({ data, onClose }: Props) {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const slideAnimation = useRef(new Animated.Value(0)).current;

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
                            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.actionButtonText, { color: theme.colors.textOnPrimary }]}>
                                Go Back
                            </Text>
                        </Pressable>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    const currentCard = data[currentIndex];

    // Smooth flip animation
    const flipCard = () => {
        Animated.timing(flipAnimation, {
            toValue: isFlipped ? 0 : 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
    };

    // Navigate to next card
    const nextCard = () => {
        if (currentIndex < data.length - 1) {
            // Reset flip state and animation
            setIsFlipped(false);
            flipAnimation.setValue(0);

            // Slide animation
            Animated.timing(slideAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setCurrentIndex(prev => prev + 1);
                slideAnimation.setValue(0);
            });
        }
    };

    // Navigate to previous card
    const prevCard = () => {
        if (currentIndex > 0) {
            // Reset flip state and animation
            setIsFlipped(false);
            flipAnimation.setValue(0);

            // Slide animation
            Animated.timing(slideAnimation, {
                toValue: -1,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setCurrentIndex(prev => prev - 1);
                slideAnimation.setValue(0);
            });
        }
    };

    // Swipe gesture handler
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 50;
        },
        onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dx > 50) {
                nextCard();
            } else if (gestureState.dx < -50) {
                prevCard();
            }
        },
    });

    // Animation styles for card rotation
    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });

    const frontOpacity = flipAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 0, 0],
    });

    const backOpacity = flipAnimation.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0, 1],
    });

    const slideTransform = slideAnimation.interpolate({
        inputRange: [-1, 0, 1],
        outputRange: [-screenWidth, 0, screenWidth],
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.colors.borderColor }]}>
                <Pressable
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </Pressable>

                <View style={styles.progressInfo}>
                    <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                        {currentIndex + 1} of {data.length}
                    </Text>
                </View>

                <View style={styles.headerSpacer} />
            </View>

            {/* Progress bar */}
            <View style={[styles.progressBarContainer, { backgroundColor: theme.colors.borderColor }]}>
                <Animated.View
                    style={[
                        styles.progressBar,
                        {
                            backgroundColor: theme.colors.primary,
                            width: `${((currentIndex + 1) / data.length) * 100}%`
                        }
                    ]}
                />
            </View>

            {/* Card container */}
            <View style={styles.cardContainer} {...panResponder.panHandlers}>
                <Animated.View
                    style={[
                        styles.cardAnimationContainer,
                        {
                            transform: [{ translateX: slideTransform }]
                        }
                    ]}
                >
                    <Pressable onPress={flipCard} style={styles.cardPressable}>
                        {/* Front of card */}
                        <Animated.View
                            style={[
                                styles.card,
                                { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor },
                                {
                                    transform: [{ rotateY: frontInterpolate }],
                                    opacity: frontOpacity,
                                }
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <View style={[styles.cardTypeBadge, { backgroundColor: theme.colors.primary }]}>
                                    <Text style={[styles.cardTypeBadgeText, { color: theme.colors.textOnPrimary }]}>
                                        TERM
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={[styles.cardTerm, { color: theme.colors.text }]}>
                                    {currentCard.term || currentCard.acronym || currentCard.port}
                                </Text>
                            </View>

                            <View style={styles.cardFooter}>
                                <Text style={[styles.flipHint, { color: theme.colors.textMuted }]}>
                                    Tap to reveal definition
                                </Text>
                            </View>
                        </Animated.View>

                        {/* Back of card */}
                        <Animated.View
                            style={[
                                styles.card,
                                styles.cardBack,
                                { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryDark },
                                {
                                    transform: [{ rotateY: backInterpolate }],
                                    opacity: backOpacity,
                                }
                            ]}
                        >
                            <View style={styles.cardHeader}>
                                <View style={[styles.cardTypeBadge, { backgroundColor: theme.colors.textOnPrimary }]}>
                                    <Text style={[styles.cardTypeBadgeText, { color: theme.colors.primary }]}>
                                        DEFINITION
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.cardContent}>
                                <Text style={[styles.cardDefinition, { color: theme.colors.textOnPrimary }]}>
                                    {currentCard.definition}
                                </Text>
                            </View>

                            <View style={styles.cardFooter}>
                                <Text style={[styles.flipHint, { color: theme.colors.textOnPrimary, opacity: 0.8 }]}>
                                    Tap to flip back
                                </Text>
                            </View>
                        </Animated.View>
                    </Pressable>
                </Animated.View>
            </View>

            {/* Navigation */}
            <View style={styles.navigationContainer}>
                <View style={styles.swipeHint}>
                    <Text style={[styles.swipeHintText, { color: theme.colors.textMuted }]}>
                        Swipe or tap buttons to navigate
                    </Text>
                </View>

                <View style={styles.navButtons}>
                    <Pressable
                        style={[
                            styles.navButton,
                            { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor },
                            currentIndex === 0 && styles.navButtonDisabled
                        ]}
                        onPress={prevCard}
                        disabled={currentIndex === 0}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={20}
                            color={currentIndex === 0 ? theme.colors.textMuted : theme.colors.text}
                        />
                        <Text style={[
                            styles.navButtonText,
                            { color: currentIndex === 0 ? theme.colors.textMuted : theme.colors.text }
                        ]}>
                            Previous
                        </Text>
                    </Pressable>

                    <Pressable
                        style={[
                            styles.navButton,
                            { backgroundColor: theme.colors.surface, borderColor: theme.colors.borderColor },
                            currentIndex === data.length - 1 && styles.navButtonDisabled
                        ]}
                        onPress={nextCard}
                        disabled={currentIndex === data.length - 1}
                    >
                        <Text style={[
                            styles.navButtonText,
                            { color: currentIndex === data.length - 1 ? theme.colors.textMuted : theme.colors.text }
                        ]}>
                            Next
                        </Text>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={currentIndex === data.length - 1 ? theme.colors.textMuted : theme.colors.text}
                        />
                    </Pressable>
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
        fontSize: 16,
        marginTop: 16,
        marginBottom: 24,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    closeButton: {
        padding: 4,
    },
    progressInfo: {
        flex: 1,
        alignItems: 'center',
    },
    progressText: {
        fontSize: 14,
        fontWeight: '500',
    },
    headerSpacer: {
        width: 32,
    },
    progressBarContainer: {
        height: 3,
        marginHorizontal: 20,
        borderRadius: 1.5,
        marginBottom: 20,
    },
    progressBar: {
        height: '100%',
        borderRadius: 1.5,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 80, // Add space to prevent overlap with navigation
    },
    cardAnimationContainer: {
        width: '100%',
        height: 350,
    },
    cardPressable: {
        width: '100%',
        height: '100%',
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 16,
        borderWidth: 1,
        backfaceVisibility: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardBack: {
        // Additional styles for back of card if needed
    },
    cardHeader: {
        padding: 20,
        paddingBottom: 0,
    },
    cardTypeBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    cardTypeBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
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
    cardFooter: {
        padding: 20,
        alignItems: 'center',
    },
    flipHint: {
        fontSize: 12,
        fontStyle: 'italic',
    },
    navigationContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    swipeHint: {
        alignItems: 'center',
        marginBottom: 16,
    },
    swipeHintText: {
        fontSize: 12,
    },
    navButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
    },
    navButtonDisabled: {
        opacity: 0.4,
    },
    navButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    actionButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
} as const;