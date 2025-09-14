import React, { useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    Animated,
    ImageBackground, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/TopBar';
import QuizRoadmap from '@/components/QuizRoadmap';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import { CERTS_ROADMAP } from '@/constants/certs';
// @ts-ignore
import path from '@/assets/images/path.png';
import {ModuleType} from "@/types/certs";

const { height: screenHeight } = Dimensions.get('window');
const TILE_SIZE = 60;
const TILE_SPACING = 8;
const TILE_COUNT = 5;

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);
    const [modulePositions, setModulePositions] = React.useState<{ [key: number]: number }>({});
    const [selectedLesson, setSelectedLesson] = React.useState<{
        modId: number;
        lessonIndex: number;
        lessonName: string;
    } | null>(null);

    function getLessonXP(mod: ModuleType, lessonIndex: number) {
        const lessonCount = mod.lessons.length;
        const lessonWeight = mod.weight / lessonCount;
        return Math.round(lessonWeight);
    }


    if (!selectedCert)
        return <Text style={{ color: '#fff', padding: 20 }}>Select a cert first</Text>;

    const modules = CERTS_ROADMAP[selectedCert];
    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => ({
        id: idx + 1,
        name,
        score: 0,
    }));

    // reversed numbers 5->1
    const numbers = Array.from({ length: TILE_COUNT }, (_, i) => TILE_COUNT - i);

    return (
        <ImageBackground
            source={path}
            style={{ flex: 1, width: 'auto' }}
            resizeMode="cover"
            imageStyle={{ resizeMode: 'cover', alignSelf: 'center' }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <TopBar
                        currentStreak={123}
                        currency={456}
                        selectedCourse={{ id: 0, name: selectedCert }}
                        enrolledCourses={enrolledCourses}
                    />

                    <QuizRoadmap />

                    <Animated.ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{
                            flexDirection: 'column-reverse',
                            alignItems: 'center',
                            paddingVertical: 30,
                        }}
                        onContentSizeChange={() => {
                            // auto-scroll to bottom once content is measured
                            scrollViewRef.current?.scrollToEnd({ animated: false });
                        }}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                    >
                        {modules.map((mod) => (
                            <View
                                key={mod.id}
                                style={{ marginBottom: 30, alignItems: 'center' }}
                            >
                                {/* TOP: Q tile */}
                                <Pressable
                                    style={{
                                        width: TILE_SIZE,
                                        height: TILE_SIZE,
                                        borderRadius: 12,
                                        marginBottom: TILE_SPACING,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#444', // Q tile color
                                    }}
                                    onPress={() =>
                                        setSelectedLesson({
                                            modId: mod.id,
                                            lessonIndex: 0, // 0 = Unit Review
                                            lessonName: `${mod.name} Unit Review`,
                                        })
                                    }
                                >
                                    <Text style={styles.tileText}>Q</Text>
                                </Pressable>

                                {/* Dynamic lesson tiles */}
                                {[...mod.lessons].reverse().map((lesson, index) => {
                                    const number = mod.lessons.length - index; // descending numbers
                                    return (
                                        <Pressable
                                            key={`${mod.id}-${number}`}
                                            style={{
                                                width: TILE_SIZE,
                                                height: TILE_SIZE,
                                                marginBottom: TILE_SPACING,
                                                borderRadius: 12,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                backgroundColor: mod.completed ? '#27b0b9' : '#1a1b1f',
                                            }}
                                            onPress={() =>
                                                setSelectedLesson({
                                                    modId: mod.id,
                                                    lessonIndex: number,
                                                    lessonName: lesson.name,
                                                })
                                            }
                                        >
                                            <Text style={styles.tileText}>{number}</Text>
                                        </Pressable>
                                    );
                                })}


                                {/* BOTTOM: Chapter name */}
                                <Animated.Text style={[styles.sectionTitle]}>
                                    {mod.name}
                                </Animated.Text>
                            </View>
                        ))}
                    </Animated.ScrollView>
                </View>
                {selectedLesson && (() => {
                    const mod = modules.find(m => m.id === selectedLesson.modId)!;
                    const lessonCount = mod.lessons.length;
                    const lessonNum = selectedLesson.lessonIndex;
                    const xp = getLessonXP(mod, selectedLesson.lessonIndex);

                    return (
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>
                                    Lesson {selectedLesson.lessonIndex} / {lessonCount}
                                </Text>
                                <Text style={styles.modalLessonName}>{selectedLesson.lessonName}</Text>
                                <Text style={styles.modalXP}>XP: {xp}</Text>
                                <Pressable
                                    style={styles.startButton}
                                    onPress={() => {
                                        router.push({
                                            pathname: '/quiz/[cert]/[id]',
                                            params: { cert: selectedCert, id: String(mod.id) },
                                        });
                                        setSelectedLesson(null);
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start</Text>
                                </Pressable>
                                <Pressable
                                    style={styles.closeButton}
                                    onPress={() => setSelectedLesson(null)}
                                >
                                    <Text style={{ color: '#fff' }}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    );
                })()}
                {selectedLesson && (() => {
                    const mod = modules.find(m => m.id === selectedLesson.modId)!;
                    const lessonCount = mod.lessons.length;

                    // Determine display name and number
                    const isUnitReview = selectedLesson.lessonIndex === 0;
                    const lessonNum = isUnitReview
                        ? 'Unit Review'
                        : selectedLesson.lessonIndex;
                    const xp = isUnitReview
                        ? mod.weight // Full module XP
                        : Math.round(mod.weight / lessonCount);

                    return (
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>
                                    {isUnitReview ? 'Unit Review' : `Lesson ${lessonNum} / ${lessonCount}`}
                                </Text>
                                <Text style={styles.modalLessonName}>
                                    {selectedLesson.lessonName}
                                </Text>
                                <Text style={styles.modalXP}>XP: {xp}</Text>

                                <Pressable
                                    style={styles.startButton}
                                    onPress={() => {
                                        // Start lesson logic
                                        router.push({
                                            pathname: '/quiz/[cert]/[id]',
                                            params: { cert: selectedCert, id: String(mod.id) },
                                        });
                                        setSelectedLesson(null);
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Start</Text>
                                </Pressable>

                                <Pressable
                                    style={styles.closeButton}
                                    onPress={() => setSelectedLesson(null)}
                                >
                                    <Text style={{ color: '#fff' }}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    );
                })()}

            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 10,
        color: '#fee37f', // fallback
    },
    tileText: { color: '#fff', fontWeight: '600' },
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#1a1b1f',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fee37f', marginBottom: 10 },
    modalLessonName: { fontSize: 16, color: '#fff', marginBottom: 10, textAlign: 'center' },
    modalXP: { fontSize: 14, color: '#ccc', marginBottom: 20 },
    startButton: {
        backgroundColor: '#27b0b9',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    closeButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
