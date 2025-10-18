// components/LessonScreen.tsx - FIXED: Handle missing content properties
import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions, Animated, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCert } from '../context/CertContext';
import { ThemedView, ThemedText, ThemedButton, ThemedCard } from './themed';
import { LESSON_CONTENT } from '../constants/lessonContent';

const { width, height } = Dimensions.get('window');

interface LessonSlide {
    type: 'intro' | 'concept' | 'keypoint' | 'example' | 'visual' | 'summary';
    title?: string;
    content: any;
    visual?: string;
}

export default function LessonScreen() {
    const router = useRouter();
    const { objective } = useLocalSearchParams<{ objective: string }>();
    const { theme } = useTheme();
    const { updateProgressField, progress } = useAuth();
    const { selectedCert } = useCert();

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isCompleting, setIsCompleting] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Get lesson content
    const lesson = LESSON_CONTENT[objective || ''];

    if (!lesson) {
        return (
            <ThemedView variant="background" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText variant="h3">Lesson content not found</ThemedText>
                <ThemedButton title="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
            </ThemedView>
        );
    }

    // Convert lesson content into digestible slides - FIXED
    const slides: LessonSlide[] = [
        // Intro slide
        {
            type: 'intro',
            title: lesson.title,
            content: lesson.content?.introduction || lesson.introduction || 'Introduction to this topic'
        },
        // Key points slides
        ...(lesson.content?.keyPoints || lesson.keyPoints || []).map((point: string, index: number) => ({
            type: 'keypoint' as const,
            title: `Key Point ${index + 1}`,
            content: point
        })),
        // Detailed content slides - FIXED: Check for different content structures
        ...(lesson.content?.layers
                ? Object.entries(lesson.content.layers).map(([name, data]: [string, any]) => ({
                    type: 'concept' as const,
                    title: name,
                    content: data
                }))
                : lesson.content?.physicalVirtualAppliances
                    ? Object.entries(lesson.content.physicalVirtualAppliances).map(([name, data]: [string, any]) => ({
                        type: 'concept' as const,
                        title: name,
                        content: data
                    }))
                    : lesson.content?.cloudConcepts
                        ? Object.entries(lesson.content.cloudConcepts).map(([name, data]: [string, any]) => ({
                            type: 'concept' as const,
                            title: name,
                            content: data
                        }))
                        : []
        ),
        // Real world scenario - FIXED: Check both locations
        ...((lesson.content?.realWorldScenario || lesson.realWorldScenario) ? [{
            type: 'example' as const,
            title: 'Real-World Application',
            content: lesson.content?.realWorldScenario || lesson.realWorldScenario
        }] : []),
        // Summary slide
        {
            type: 'summary',
            title: 'Lesson Complete! 🎉',
            content: `You've learned about ${lesson.title}. Ready to test your knowledge?`
        }
    ];

    const totalSlides = slides.length;
    const progressPercentage = ((currentSlide + 1) / totalSlides) * 100;

    // Animate slide transitions
    const animateSlide = (direction: 'next' | 'prev') => {
        Animated.sequence([
            Animated.timing(slideAnim, {
                toValue: direction === 'next' ? -50 : 50,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleNext = () => {
        if (currentSlide < totalSlides - 1) {
            animateSlide('next');
            setCurrentSlide(currentSlide + 1);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            animateSlide('prev');
            setCurrentSlide(currentSlide - 1);
        }
    };

    const handleComplete = async () => {
        setIsCompleting(true);
        try {
            // Mark lesson content as viewed
            const viewedContent = progress?.viewedLessonContent || [];
            const contentKey = `${selectedCert}_${objective}`;

            if (!viewedContent.includes(contentKey)) {
                await updateProgressField('viewedLessonContent', [...viewedContent, contentKey]);
            }

            // Navigate to practice quiz
            router.replace(`/quiz/${objective}/practice`);
        } catch (error) {
            console.error('Failed to mark lesson as viewed:', error);
        } finally {
            setIsCompleting(false);
        }
    };

    const currentSlideData = slides[currentSlide];

    // Render slide content based on type
    const renderSlideContent = () => {
        switch (currentSlideData.type) {
            case 'intro':
                return (
                    <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.xl }}>
                        <View style={{
                            backgroundColor: theme.colors.primary + '20',
                            padding: theme.spacing.xl,
                            borderRadius: theme.borderRadius.xl,
                            borderLeftWidth: 4,
                            borderLeftColor: theme.colors.primary,
                        }}>
                            <Ionicons
                                name="book"
                                size={48}
                                color={theme.colors.primary}
                                style={{ marginBottom: theme.spacing.md }}
                            />
                            <ThemedText variant="h2" style={{ marginBottom: theme.spacing.md }}>
                                {currentSlideData.title}
                            </ThemedText>
                            <ThemedText variant="body1" style={{ lineHeight: 28 }}>
                                {currentSlideData.content}
                            </ThemedText>
                        </View>
                    </View>
                );

            case 'keypoint':
                return (
                    <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.xl }}>
                        <ThemedCard variant="elevated">
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                marginBottom: theme.spacing.md
                            }}>
                                <View style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 20,
                                    backgroundColor: theme.colors.primary,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: theme.spacing.md
                                }}>
                                    <Ionicons name="bulb" size={24} color={theme.colors.textOnPrimary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <ThemedText variant="h3" style={{ marginBottom: theme.spacing.sm }}>
                                        {currentSlideData.title}
                                    </ThemedText>
                                    <ThemedText variant="body1" style={{ lineHeight: 26 }}>
                                        {currentSlideData.content}
                                    </ThemedText>
                                </View>
                            </View>
                        </ThemedCard>
                    </View>
                );

            case 'concept':
                const conceptData = currentSlideData.content;
                return (
                    <ScrollView
                        style={{ flex: 1 }}
                        contentContainerStyle={{ padding: theme.spacing.lg }}
                        showsVerticalScrollIndicator={false}
                    >
                        <ThemedText variant="h3" style={{ marginBottom: theme.spacing.md }}>
                            {currentSlideData.title}
                        </ThemedText>

                        {conceptData.description && (
                            <ThemedCard variant="default" style={{ marginBottom: theme.spacing.md }}>
                                <ThemedText variant="body1" style={{ lineHeight: 24 }}>
                                    {conceptData.description}
                                </ThemedText>
                            </ThemedCard>
                        )}

                        {conceptData.function && (
                            <ThemedCard variant="default" style={{ marginBottom: theme.spacing.md }}>
                                <ThemedText variant="body1" style={{ lineHeight: 24 }}>
                                    {conceptData.function}
                                </ThemedText>
                            </ThemedCard>
                        )}

                        {conceptData.functions && (
                            <View style={{ marginBottom: theme.spacing.md }}>
                                <ThemedText variant="h4" style={{ marginBottom: theme.spacing.sm }}>
                                    Functions:
                                </ThemedText>
                                {Array.isArray(conceptData.functions) ? (
                                    conceptData.functions.map((func: string, idx: number) => (
                                        <View key={idx} style={{
                                            flexDirection: 'row',
                                            marginBottom: theme.spacing.xs,
                                            alignItems: 'flex-start'
                                        }}>
                                            <ThemedText style={{ marginRight: theme.spacing.sm }}>•</ThemedText>
                                            <ThemedText variant="body2" style={{ flex: 1 }}>
                                                {func}
                                            </ThemedText>
                                        </View>
                                    ))
                                ) : (
                                    <ThemedText variant="body2">{conceptData.functions}</ThemedText>
                                )}
                            </View>
                        )}

                        {conceptData.examples && (
                            <ThemedCard variant="elevated" style={{
                                backgroundColor: theme.colors.info + '15',
                                borderLeftWidth: 4,
                                borderLeftColor: theme.colors.info
                            }}>
                                <ThemedText variant="h4" style={{ marginBottom: theme.spacing.sm }}>
                                    Examples:
                                </ThemedText>
                                <ThemedText variant="body2" style={{ lineHeight: 22 }}>
                                    {conceptData.examples}
                                </ThemedText>
                            </ThemedCard>
                        )}
                    </ScrollView>
                );

            case 'example':
                return (
                    <View style={{ flex: 1, justifyContent: 'center', padding: theme.spacing.xl }}>
                        <ThemedCard variant="elevated" style={{
                            backgroundColor: theme.colors.success + '15',
                            borderLeftWidth: 4,
                            borderLeftColor: theme.colors.success
                        }}>
                            <Ionicons
                                name="checkmark-circle"
                                size={48}
                                color={theme.colors.success}
                                style={{ marginBottom: theme.spacing.md }}
                            />
                            <ThemedText variant="h3" style={{ marginBottom: theme.spacing.md }}>
                                {currentSlideData.title}
                            </ThemedText>
                            <ThemedText variant="body1" style={{ lineHeight: 26 }}>
                                {currentSlideData.content}
                            </ThemedText>
                        </ThemedCard>
                    </View>
                );

            case 'summary':
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl }}>
                        <LinearGradient
                            colors={[theme.colors.primary + '30', theme.colors.accent + '30']}
                            style={{
                                width: '100%',
                                padding: theme.spacing.xl,
                                borderRadius: theme.borderRadius.xl,
                                alignItems: 'center'
                            }}
                        >
                            <Ionicons name="trophy" size={72} color={theme.colors.primary} />
                            <ThemedText variant="h2" style={{ marginTop: theme.spacing.lg, textAlign: 'center' }}>
                                {currentSlideData.title}
                            </ThemedText>
                            <ThemedText
                                variant="body1"
                                style={{
                                    marginTop: theme.spacing.md,
                                    textAlign: 'center',
                                    lineHeight: 26
                                }}
                            >
                                {currentSlideData.content}
                            </ThemedText>

                            <ThemedButton
                                title={isCompleting ? "Loading..." : "Start Practice Quiz →"}
                                onPress={handleComplete}
                                disabled={isCompleting}
                                style={{
                                    marginTop: theme.spacing.xl,
                                    width: '100%'
                                }}
                            />
                        </LinearGradient>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            {/* Header with progress */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: theme.spacing.md,
                backgroundColor: theme.colors.surface,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.borderColor,
            }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: theme.colors.surfaceVariant
                    }}
                >
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                </Pressable>

                <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                    <View style={{
                        height: 8,
                        backgroundColor: theme.colors.surfaceVariant,
                        borderRadius: 4,
                        overflow: 'hidden'
                    }}>
                        <Animated.View style={{
                            height: '100%',
                            width: `${progressPercentage}%`,
                            backgroundColor: theme.colors.primary,
                            borderRadius: 4,
                        }} />
                    </View>
                    <ThemedText variant="caption" style={{ textAlign: 'center', marginTop: 4 }}>
                        {currentSlide + 1} / {totalSlides}
                    </ThemedText>
                </View>

                <View style={{ width: 40 }} />
            </View>

            {/* Slide Content */}
            <Animated.View
                style={{
                    flex: 1,
                    transform: [{ translateX: slideAnim }]
                }}
            >
                {renderSlideContent()}
            </Animated.View>

            {/* Navigation Footer */}
            {currentSlide < totalSlides - 1 && (
                <View style={{
                    flexDirection: 'row',
                    padding: theme.spacing.md,
                    backgroundColor: theme.colors.surface,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.borderColor,
                    gap: theme.spacing.md
                }}>
                    <ThemedButton
                        title="← Back"
                        variant="outline"
                        onPress={handlePrev}
                        disabled={currentSlide === 0}
                        style={{ flex: 1 }}
                    />
                    <ThemedButton
                        title="Next →"
                        variant="primary"
                        onPress={handleNext}
                        style={{ flex: 1 }}
                    />
                </View>
            )}
        </SafeAreaView>
    );
}