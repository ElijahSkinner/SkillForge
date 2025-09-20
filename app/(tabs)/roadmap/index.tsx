import React, { useRef, useState, useEffect } from 'react';
import {
    ImageBackground,
    View,
    Pressable,
    Dimensions,
    Animated,
    ScrollView,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import { CERTS_ROADMAP } from '@/constants/certs';
import { ModuleType } from "@/types/certs";
import { ThemedView, ThemedText } from '@/components/themed';
import TopBar from '@/components/TopBar';
import LessonSelectionModal from '@/components/modals/LessonSelectionModal';
import AnimatedProgressTile from '@/components/modals/AnimatedProgressTile';

const { TILE_SIZE, TILE_SPACING } = { TILE_SIZE: 70, TILE_SPACING: 12 };

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const { progress, addCompletedLesson } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);

    // Modal state for lesson selection
    const [selectedLesson, setSelectedLesson] = useState<{
        modId: number;
        lessonIndex: number;
        lessonName: string;
        moduleWeight: number;
        totalLessons: number;
    } | null>(null);

    // Loading state for progress updates
    const [updatingProgress, setUpdatingProgress] = useState<string | null>(null);

    // Get user's progress for lessons and modules
    const completedLessons = progress?.completedLessons || [];
    const completedModules = progress?.completedModules || [];

    // Helper function to get lesson completion status
    const getLessonProgress = (moduleId: number, lessonIndex: number) => {
        const lessonKey = `${selectedCert}_${moduleId}_${lessonIndex}`;
        return completedLessons.includes(lessonKey);
    };

    // Helper function to get module completion percentage
    const getModuleProgress = (module: ModuleType) => {
        const totalLessons = module.lessons.length;
        let completedCount = 0;

        for (let i = 1; i <= totalLessons; i++) {
            if (getLessonProgress(module.id, i)) {
                completedCount++;
            }
        }

        return totalLessons > 0 ? completedCount / totalLessons : 0;
    };

    // Helper function to calculate XP for lesson
    const getLessonXP = (module: ModuleType, lessonIndex: number) => {
        const lessonCount = module.lessons.length;
        const lessonWeight = module.weight / lessonCount;
        return Math.round(lessonWeight);
    };

    // Handle lesson start - update progress in Appwrite
    const handleLessonStart = async (lesson: typeof selectedLesson) => {
        if (!lesson || !progress) return;

        setUpdatingProgress(`${lesson.modId}_${lesson.lessonIndex}`);

        try {
            const lessonKey = `${selectedCert}_${lesson.modId}_${lesson.lessonIndex}`;
            const newCompletedLessons = [...completedLessons];

            if (!newCompletedLessons.includes(lessonKey)) {
                // Find the module to get XP
                const currentModule = modules.find(m => m.id === lesson.modId);
                if (currentModule) {
                    // Update in Appwrite using the context helper
                    await addCompletedLesson(
                        selectedCert || '',
                        lesson.modId,
                        lesson.lessonIndex,
                        getLessonXP(currentModule, lesson.lessonIndex)
                    );
                }
            }

            // Navigate to quiz
            router.push({
                pathname: '/(tabs)/quiz/[cert]/[id]' as any,
                params: { cert: selectedCert || '', id: String(lesson.modId) },
            });
        } catch (error) {
            console.error('Failed to update lesson progress:', error);
        } finally {
            setUpdatingProgress(null);
            setSelectedLesson(null);
        }
    };

    if (!selectedCert) {
        return (
            <ThemedView variant="background" style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <ThemedText
                        variant="body1"
                        color="textSecondary"
                        style={styles.message}
                    >
                        Please select a certification first.
                    </ThemedText>
                    <Pressable
                        style={[styles.button, { backgroundColor: theme.colors.primary }]}
                        onPress={() => router.push('/(tabs)/course')}
                    >
                        <ThemedText variant="button" style={{ color: theme.colors.textOnPrimary }}>
                            Select a Cert
                        </ThemedText>
                    </Pressable>
                </SafeAreaView>
            </ThemedView>
        );
    }

    const modules = CERTS_ROADMAP[selectedCert] || [];

    // Create enrolled courses safely
    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => {
        // Create a dummy module for progress calculation
        const dummyModule: ModuleType = {
            id: idx,
            name: name,
            weight: 100,
            completed: false,
            lessons: []
        };

        return {
            id: idx + 1,
            name,
            score: Math.round(getModuleProgress(dummyModule) * 100),
        };
    });

    // Get background image safely
    const backgroundImage = theme.assets?.roadmapBackground || require('@/assets/forge/path.png');

    return (
        <ImageBackground
            source={backgroundImage}
            style={styles.backgroundImage}
            resizeMode="cover"
            imageStyle={styles.backgroundImageStyle}
        >
            <ThemedView variant="background" style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <TopBar
                        currentStreak={progress?.currentStreak || 0}
                        currency={progress?.xp || 0}
                        selectedCourse={{ id: 0, name: selectedCert }}
                        enrolledCourses={enrolledCourses}
                    />

                    <Animated.ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={[
                            styles.scrollContent,
                            { paddingVertical: theme.spacing.xl }
                        ]}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                    >
                        {modules.map((module) => {
                            const moduleProgress = getModuleProgress(module);
                            const isModuleComplete = moduleProgress === 1;

                            return (
                                <View
                                    key={module.id}
                                    style={[styles.moduleContainer, { marginBottom: theme.spacing.xl }]}
                                >
                                    {/* Unit Review Tile (Q) */}
                                    <AnimatedProgressTile
                                        size={TILE_SIZE}
                                        progress={isModuleComplete ? 1 : 0}
                                        onPress={() => setSelectedLesson({
                                            modId: module.id,
                                            lessonIndex: 0,
                                            lessonName: `${module.name} Unit Review`,
                                            moduleWeight: module.weight,
                                            totalLessons: module.lessons.length
                                        })}
                                        backgroundColor={theme.colors.secondary}
                                        progressColor={theme.colors.success}
                                        style={[styles.tile, { marginBottom: TILE_SPACING }]}
                                    >
                                        <ThemedText variant="h4" color="text">Q</ThemedText>
                                    </AnimatedProgressTile>

                                    {/* Individual Lesson Tiles - CORRECTED ORDER */}
                                    {module.lessons.slice().reverse().map((lesson, index) => {
                                        // Since we reversed the lessons, index 0 is now the last lesson
                                        const lessonNumber = module.lessons.length - index;
                                        const isLessonComplete = getLessonProgress(module.id, lessonNumber);
                                        const lessonProgress = isLessonComplete ? 1 : 0;

                                        return (
                                            <AnimatedProgressTile
                                                key={`${module.id}-${lessonNumber}`}
                                                size={TILE_SIZE}
                                                progress={lessonProgress}
                                                onPress={() => setSelectedLesson({
                                                    modId: module.id,
                                                    lessonIndex: lessonNumber,
                                                    lessonName: lesson.name,
                                                    moduleWeight: module.weight,
                                                    totalLessons: module.lessons.length
                                                })}
                                                backgroundColor={isLessonComplete
                                                    ? theme.colors.success
                                                    : theme.colors.surface
                                                }
                                                progressColor={theme.colors.primary}
                                                style={[styles.tile, { marginBottom: TILE_SPACING }]}
                                                disabled={updatingProgress === `${module.id}_${lessonNumber}`}
                                            >
                                                <ThemedText
                                                    variant="h4"
                                                    style={{
                                                        color: isLessonComplete ? theme.colors.success : theme.colors.text
                                                    }}
                                                >
                                                    {lessonNumber}
                                                </ThemedText>
                                            </AnimatedProgressTile>
                                        );
                                    })}

                                    {/* Module Name */}
                                    <ThemedText
                                        variant="h3"
                                        color="text"
                                        style={[
                                            styles.sectionTitle,
                                            {
                                                marginTop: theme.spacing.md,
                                                textAlign: 'center',
                                                color: theme.colors.text
                                            }
                                        ]}
                                    >
                                        {module.name}
                                    </ThemedText>

                                    {/* Module Progress Indicator */}
                                    <View style={[styles.progressContainer, { marginTop: theme.spacing.sm }]}>
                                        <View
                                            style={[
                                                styles.progressBar,
                                                { backgroundColor: theme.colors.borderColor }
                                            ]}
                                        >
                                            <View
                                                style={[
                                                    styles.progressFill,
                                                    {
                                                        backgroundColor: theme.colors.primary,
                                                        width: `${moduleProgress * 100}%`
                                                    }
                                                ]}
                                            />
                                        </View>
                                        <ThemedText variant="caption" color="textSecondary" style={styles.progressText}>
                                            {Math.round(moduleProgress * 100)}% Complete
                                        </ThemedText>
                                    </View>
                                </View>
                            );
                        })}
                    </Animated.ScrollView>

                    {/* Lesson Selection Modal */}
                    <LessonSelectionModal
                        visible={selectedLesson !== null}
                        lesson={selectedLesson}
                        onClose={() => setSelectedLesson(null)}
                        onStart={() => selectedLesson && handleLessonStart(selectedLesson)}
                        loading={updatingProgress !== null}
                    />
                </SafeAreaView>
            </ThemedView>
        </ImageBackground>
    );
}

const styles = {
    container: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: 16,
    },
    backgroundImage: {
        flex: 1,
        width: '100%' as const,
    },
    backgroundImageStyle: {
        resizeMode: 'cover' as const,
        alignSelf: 'center' as const,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent overlay
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        flexDirection: 'column-reverse' as const,
        alignItems: 'center' as const,
        paddingHorizontal: 16,
    },
    moduleContainer: {
        alignItems: 'center' as const,
        width: '100%' as const,
    },
    tile: {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        borderRadius: 16,
    },
    sectionTitle: {
        fontWeight: 'bold' as const,
        textAlign: 'center' as const,
    },
    progressContainer: {
        width: '80%' as const,
        alignItems: 'center' as const,
    },
    progressBar: {
        width: '100%' as const,
        height: 4,
        borderRadius: 2,
        overflow: 'hidden' as const,
    },
    progressFill: {
        height: '100%' as const,
        borderRadius: 2,
    },
    progressText: {
        marginTop: 4,
        fontSize: 12,
    },
    message: {
        textAlign: 'center' as const,
        marginBottom: 20,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
} as const;