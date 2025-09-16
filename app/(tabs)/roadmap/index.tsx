import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    Animated,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/TopBar';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import { CERTS_ROADMAP } from '@/constants/certs';
import {ModuleType} from "@/types/certs";

const { TILE_SIZE, TILE_SPACING } = { TILE_SIZE: 60, TILE_SPACING: 8 };

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);

    //For Tile Modal data
    const [selectedLesson, setSelectedLesson] = React.useState<{
        modId: number;
        lessonIndex: number;
        lessonName: string;
    } | null>(null);
    function getLessonXP(mod: ModuleType, lessonIndex: number) {
        const lessonCount = mod.lessons.length;
        const lessonWeight = mod.weight / lessonCount;
        return Math.round(lessonWeight); // Round to whole number
    }

    // For tooltip popup
    const [popup, setPopup] = useState<{
        x: number;
        y: number;
        width: number;
        data: any;
    } | null>(null);

    if (!selectedCert)
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please select a certification first.</Text>
                <Pressable style={styles.button} onPress={() => router.push('../course')}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Select a Cert</Text>
                </Pressable>
            </View>
        );

    const modules = CERTS_ROADMAP[selectedCert];
    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => ({
        id: idx + 1,
        name,
        score: 0,
    }));

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopBar
                currentStreak={123}
                currency={456}
                selectedCourse={{ id: 0, name: selectedCert }}
                enrolledCourses={enrolledCourses}
            />

            <Animated.ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{
                    flexDirection: 'column-reverse',
                    alignItems: 'center',
                    paddingVertical: 30,
                }}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
                scrollEventThrottle={16}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
            >
                {modules.map((mod) => (
                    <View key={mod.id} style={{ marginBottom: 30, alignItems: 'center' }}>
                        {/* Q Tile */}
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


                        {/* Lesson Tiles */}
                        {[...mod.lessons].reverse().map((lesson, index) => {
                            const lessonIndex = mod.lessons.length - 1 - index; // actual index in array
                            const displayNumber = index + 1; // 1,2,3… bottom-to-top
                            return (
                                <Pressable
                                    key={`${mod.id}-${displayNumber}`}
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
                                            lessonIndex: lessonIndex, // actual index in lessons array
                                            lessonName: lesson.name,
                                        })
                                    }
                                >
                                    <Text style={styles.tileText}>{displayNumber}</Text>
                                </Pressable>
                            );
                        })}

                        {/* Module Name */}
                        <Text style={styles.sectionTitle}>{mod.name}</Text>
                    </View>
                ))}
            </Animated.ScrollView>

            {/* Tooltip Popup */}
            {popup && (
                <Pressable style={styles.popupOverlay} onPress={() => setPopup(null)}>
                    <View
                        style={[
                            styles.popup,
                            {
                                top: popup.y,
                                left: popup.x,
                                width: popup.width + 60,
                            },
                        ]}
                    >
                        {popup.data.type === 'quiz' ? (
                            <>
                                <Text style={styles.popupTitle}>{popup.data.moduleName} - Unit Review</Text>
                                <Text style={styles.popupText}>XP: {popup.data.xp}</Text>
                                <Text style={styles.popupText}>{popup.data.info}</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.popupTitle}>
                                    {popup.data.moduleName} - Lesson {popup.data.lessonNumber}
                                </Text>
                                <Text style={styles.popupText}>{popup.data.lessonName}</Text>
                                <Text style={styles.popupText}>XP: {popup.data.xp}</Text>
                            </>
                        )}
                    </View>
                </Pressable>
            )}
            {selectedLesson && (() => {
                const mod = modules.find(m => m.id === selectedLesson.modId)!;
                const lessonCount = mod.lessons.length;

                // Determine display name and number
                const isUnitReview = selectedLesson.lessonIndex === 0;
                const lessonNum = isUnitReview
                    ? 'Unit Review'
                    : lessonCount - selectedLesson.lessonIndex + 1;
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
    );
}

const styles = StyleSheet.create({
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

    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 10,
        color: '#fee37f',
    },
    tileText: { color: '#fff', fontWeight: '600' },
    container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 16 },
    message: { color: '#aaa', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    button: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#27b0b9', borderRadius: 8 },
    qTile: { width: TILE_SIZE, height: TILE_SIZE, borderRadius: 12, marginBottom: TILE_SPACING, justifyContent: 'center', alignItems: 'center', backgroundColor: '#444' },
    lessonTile: { width: TILE_SIZE, height: TILE_SIZE, marginBottom: TILE_SPACING, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    popupOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 10,
    },
    popup: {
        position: 'absolute',
        backgroundColor: '#1e1e1e',
        padding: 12,
        borderRadius: 12,
        zIndex: 20,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    popupTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 6 },
    popupText: { color: '#fff', fontSize: 14 },
});
