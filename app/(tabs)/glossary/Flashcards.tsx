// app/(tabs)/glossary/Flashcards.tsx - Ultra-smooth, Duolingo-beating UI with Swipe
import React, { useState, useRef } from 'react';
import { View, PanResponder, Animated } from 'react-native';
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

    // Animation for card dragging
    const cardPosition = useRef(new Animated.Value(0)).current;
    const cardOpacity = useRef(new Animated.Value(1)).current;

    // Reset animations when card changes
    const resetCardPosition = () => {
        cardPosition.setValue(0);
        cardOpacity.setValue(1);
        setShowDefinition(false);
    };

    // Swipe gesture handler with smooth dragging
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return Math.abs(gestureState.dx) > 15 && Math.abs(gestureState.dy) < 80;
        },
        onPanResponderMove: (_, gestureState) => {
            // Card follows finger smoothly
            cardPosition.setValue(gestureState.dx * 0.8);

            // Subtle fade as card moves
            const fadeAmount = Math.abs(gestureState.dx) / 150;
            cardOpacity.setValue(Math.max(0.6, 1 - fadeAmount));
        },
        onPanResponderRelease: (_, gestureState) => {
            const swipeThreshold = 60;

            if (Math.abs(gestureState.dx) > swipeThreshold) {
                // Determine direction and change card immediately
                const goingNext = gestureState.dx < 0;

                if (goingNext && currentIndex < data.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    resetCardPosition();
                } else if (!goingNext && currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                    resetCardPosition();
                } else {
                    // Can't go further, snap back
                    Animated.spring(cardPosition, {
                        toValue: 0,
                        tension: 150,
                        friction: 8,
                        useNativeDriver: true,
                    }).start();
                    Animated.spring(cardOpacity, {
                        toValue: 1,
                        tension: 150,
                        friction: 8,
                        useNativeDriver: true,
                    }).start();
                }
            } else {
                // Snap back to center
                Animated.spring(cardPosition, {
                    toValue: 0,
                    tension: 150,
                    friction: 8,
                    useNativeDriver: true,
                }).start();
                Animated.spring(cardOpacity, {
                    toValue: 1,
                    tension: 150,
                    friction: 8,
                    useNativeDriver: true,
                }).start();
            }
        },
    });

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
            resetCardPosition();
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            resetCardPosition();
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
                <ThemedText variant="h4" style={{ fontWeight: '700', letterSpacing: 0.5 }}>
                    {Math.round(progress)}%
                </ThemedText>
                <View style={{ width: 40 }} />
            </ThemedView>

            {/* Beautiful Progress Bar with Glow - Bigger */}
            <View style={{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg }}>
                <ThemedProgressBar
                    progress={progress}
                    variant="thick"
                    showGlow={true}
                    color="primary"
                />
            </View>

            {/* Stunning Flashcard with Swipe */}
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.xl
                }}
                {...panResponder.panHandlers}
            >
                <Animated.View
                    style={{
                        transform: [{ translateX: cardPosition }],
                        opacity: cardOpacity,
                    }}
                >
                    <ThemedCard
                        variant={showDefinition ? 'flashcard-flipped' : 'flashcard'}
                        onPress={flipCard}
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
                            {showDefinition ? '👆 Tap to flip • 🤏 Drag to navigate' : '👆 Tap to reveal • 🤏 Drag to navigate'}
                        </ThemedText>
                    </ThemedCard>
                </Animated.View>
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