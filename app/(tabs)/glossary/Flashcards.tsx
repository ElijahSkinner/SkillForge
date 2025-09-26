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

    // Simple, reliable card sliding animation
    const cardPosition = useRef(new Animated.Value(0)).current;
    const [isAnimating, setIsAnimating] = useState(false);

    // Clean card transition
    const changeCard = (direction: 'next' | 'prev') => {
        if (isAnimating) return;

        const canGoNext = direction === 'next' && currentIndex < data.length - 1;
        const canGoPrev = direction === 'prev' && currentIndex > 0;

        if (!canGoNext && !canGoPrev) return;

        setIsAnimating(true);

        // Animate card sliding out
        const slideOut = direction === 'next' ? -400 : 400;

        Animated.timing(cardPosition, {
            toValue: slideOut,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            // Update card index
            if (direction === 'next') {
                setCurrentIndex(currentIndex + 1);
            } else {
                setCurrentIndex(currentIndex - 1);
            }

            // Reset flip state
            setShowDefinition(false);

            // Position new card off-screen on opposite side
            const slideIn = direction === 'next' ? 400 : -400;
            cardPosition.setValue(slideIn);

            // Animate new card sliding in
            Animated.timing(cardPosition, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => {
                setIsAnimating(false);
            });
        });
    };

    // Simple swipe gesture
    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => !isAnimating,
        onMoveShouldSetPanResponder: (_, gestureState) => {
            return !isAnimating && Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100;
        },
        onPanResponderMove: (_, gestureState) => {
            if (isAnimating) return;

            // Add resistance at boundaries
            const canGoNext = currentIndex < data.length - 1;
            const canGoPrev = currentIndex > 0;

            let resistance = 1;
            if ((gestureState.dx < 0 && !canGoNext) || (gestureState.dx > 0 && !canGoPrev)) {
                resistance = 0.3;
            }

            cardPosition.setValue(gestureState.dx * resistance);
        },
        onPanResponderRelease: (_, gestureState) => {
            if (isAnimating) return;

            const swipeThreshold = 100;

            if (gestureState.dx < -swipeThreshold && currentIndex < data.length - 1) {
                changeCard('next');
            } else if (gestureState.dx > swipeThreshold && currentIndex > 0) {
                changeCard('prev');
            } else {
                // Snap back
                Animated.spring(cardPosition, {
                    toValue: 0,
                    tension: 300,
                    friction: 30,
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
        if (!isTransitioning) {
            changeCard('next');
        }
    };

    const prevCard = () => {
        if (!CSST) {
            changeCard('prev');
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
                {/* Current Card */}
                <Animated.View
                    style={{
                        transform: [{ translateX: cardPosition }],
                        position: 'absolute',
                        width: '100%',
                    }}
                >
                    <ThemedCard
                        variant={showDefinition ? 'flashcard-flipped' : 'flashcard'}
                        onPress={flipCard}
                    >
                        <ThemedBadge
                            text={showDefinition ? 'DEFINITION' : 'TERM'}
                            variant={showDefinition ? 'inverted' : 'primary'}
                            size="medium"
                        />

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

                        <ThemedText
                            variant="caption"
                            style={{
                                fontStyle: 'italic',
                                textAlign: 'center',
                                opacity: 0.8,
                                color: showDefinition ? theme.colors.textOnPrimary : theme.colors.textMuted
                            }}
                        >
                            👆 Tap to flip • 🤏 Drag to navigate
                        </ThemedText>
                    </ThemedCard>
                </Animated.View>

                {/* Next Card Preview */}
                {nextCardData && (
                    <Animated.View
                        style={{
                            transform: [{ translateX: nextCardPosition }],
                            position: 'absolute',
                            width: '100%',
                        }}
                    >
                        <ThemedCard variant="flashcard">
                            <ThemedBadge
                                text="TERM"
                                variant="primary"
                                size="medium"
                            />

                            <ThemedText
                                variant="h2"
                                style={{
                                    textAlign: 'center',
                                    letterSpacing: -0.5,
                                    lineHeight: 36,
                                    color: theme.colors.text,
                                    paddingHorizontal: theme.spacing.sm,
                                }}
                            >
                                {nextCardData.term || nextCardData.acronym || nextCardData.port}
                            </ThemedText>

                            <ThemedText
                                variant="caption"
                                style={{
                                    fontStyle: 'italic',
                                    textAlign: 'center',
                                    opacity: 0.8,
                                    color: theme.colors.textMuted
                                }}
                            >
                                👆 Tap to flip • 🤏 Drag to navigate
                            </ThemedText>
                        </ThemedCard>
                    </Animated.View>
                )}
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