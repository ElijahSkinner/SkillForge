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

    export default function Flashcards({ data, onClose }: Props) {
        const { theme } = useTheme();
        const [currentIndex, setCurrentIndex] = useState(0);
        const [showDefinition, setShowDefinition] = useState(false);

        // Animation for card dragging
        const cardPosition = useRef(new Animated.Value(0)).current;
        const cardOpacity = useRef(new Animated.Value(1)).current;

        // Swipe gesture handler with smooth dragging
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 100;
            },
            onPanResponderMove: (_, gestureState) => {
                // Card follows finger with resistance
                const resistance = 0.7;
                cardPosition.setValue(gestureState.dx * resistance);

                // Fade out as card moves away
                const fadeThreshold = 100;
                const opacity = Math.max(0.3, 1 - Math.abs(gestureState.dx) / fadeThreshold);
                cardOpacity.setValue(opacity);
            },
            onPanResponderRelease: (_, gestureState) => {
                const swipeThreshold = 80;

                if (Math.abs(gestureState.dx) > swipeThreshold) {
                    // Animate card flying off screen
                    const direction = gestureState.dx > 0 ? 1 : -1;
                    Animated.parallel([
                        Animated.timing(cardPosition, {
                            toValue: direction * 400,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(cardOpacity, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        })
                    ]).start(() => {
                        // Change card and reset position
                        if (direction > 0) {
                            prevCard();
                        } else {
                            nextCard();
                        }

                        // Reset card position and opacity
                        cardPosition.setValue(0);
                        cardOpacity.setValue(1);
                    });
                } else {
                    // Snap back to center
                    Animated.parallel([
                        Animated.spring(cardPosition, {
                            toValue: 0,
                            tension: 100,
                            friction: 8,
                            useNativeDriver: true,
                        }),
                        Animated.spring(cardOpacity, {
                            toValue: 1,
                            tension: 100,
                            friction: 8,
                            useNativeDriver: true,
                        })
                    ]).start();
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
                    <ThemedCard
                        variant={showDefinition ? 'flashcard-flipped' : 'flashcard'}
                        onPress={flipCard}
                        style={{
                            transform: [
                                { translateX: cardPosition },
                                { scale: 1 }
                            ],
                            opacity: cardOpacity,
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
                            {showDefinition ? '👆 Tap to flip • 🤏 Drag to navigate' : '👆 Tap to reveal • 🤏 Drag to navigate'}
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
    }}