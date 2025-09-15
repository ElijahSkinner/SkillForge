import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    Animated,
    ImageBackground,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/TopBar';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import { CERTS_ROADMAP } from '@/constants/certs';
// @ts-ignore
import path from '@/assets/images/path.png';
import { ModuleType } from "@/types/certs";

const { height: screenHeight } = Dimensions.get('window');
const TILE_SIZE = 60;
const TILE_SPACING = 8;
const TILE_COUNT = 5;

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);
    const [textColor, setTextColor] = useState('#fee37f'); // default title color
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

    const handleScroll = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;

        // Example ranges – tweak these based on your backgrounds
        if (y < 200) {
            setTextColor('#111'); // dark text for light backgrounds
        } else if (y >= 200 && y < 500) {
            setTextColor('#fff'); // light text for dark backgrounds
        } else {
            setTextColor('#fee37f'); // accent color
        }
    };

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

                    <Animated.ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{
                            flexDirection: 'column-reverse',
                            alignItems: 'center',
                            paddingVertical: 30,
                        }}
                        onContentSizeChange={() => {
                            scrollViewRef.current?.scrollToEnd({ animated: false });
                        }}
                        scrollEventThrottle={16}
                        onScroll={(e) => {
                            handleScroll(e);
                            scrollY.setValue(e.nativeEvent.contentOffset.y);
                        }}
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
                                        backgroundColor: '#444',
                                    }}
                                    onPress={() =>
                                        setSelectedLesson({
                                            modId: mod.id,
                                            lessonIndex: 0,
                                            lessonName: `${mod.name} Unit Review`,
                                        })
                                    }
                                >
                                    <Text style={styles.tileText}>Q</Text>
                                </Pressable>

                                {/* Lesson tiles */}
                                {[...mod.lessons].reverse().map((lesson, index) => {
                                    const number = mod.lessons.length - index;
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
                                                backgroundColor: mod.completed
                                                    ? '#27b0b9'
                                                    : '#1a1b1f',
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

                                {/* Chapter name with dynamic color */}
                                <Animated.Text style={[styles.sectionTitle, { color: textColor }]}>
                                    {mod.name}
                                </Animated.Text>
                            </View>
                        ))}
                    </Animated.ScrollView>
                </View>

                {selectedLesson && (() => {
                    const mod = modules.find(m => m.id === selectedLesson.modId)!;
                    const lessonCount = mod.lessons.length;

                    const isUnitReview = selectedLesson.lessonIndex === 0;
                    const lessonNum = isUnitReview
                        ? 'Unit Review'
                        : selectedLesson.lessonIndex;
                    const xp = isUnitReview
                        ? mod.weight
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
