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

const { TILE_SIZE, TILE_SPACING } = { TILE_SIZE: 60, TILE_SPACING: 8 };

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);

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
                            style={styles.qTile}
                            onPress={(e) => {
                                e.target.measure((fx, fy, width, height, px, py) => {
                                    setPopup({
                                        x: px,
                                        y: py - 80,
                                        width,
                                        data: {
                                            type: 'quiz',
                                            moduleName: mod.name,
                                            xp: mod.weight,
                                            info: 'Unit Review / Quiz info',
                                        },
                                    });
                                });
                            }}
                        >
                            <Text style={styles.tileText}>Q</Text>
                        </Pressable>

                        {/* Lesson Tiles */}
                        {mod.lessons.map((lesson, index) => (
                            <Pressable
                                key={`${mod.id}-${index}`}
                                style={[styles.lessonTile, { backgroundColor: mod.completed ? '#27b0b9' : '#1a1b1f' }]}
                                onPress={(e) => {
                                    e.target.measure((fx, fy, width, height, px, py) => {
                                        setPopup({
                                            x: px,
                                            y: py - 80,
                                            width,
                                            data: {
                                                type: 'lesson',
                                                moduleName: mod.name,
                                                lessonNumber: index + 1,
                                                lessonName: lesson.name,
                                                xp: lesson.xp,
                                            },
                                        });
                                    });
                                }}
                            >
                                <Text style={styles.tileText}>{index + 1}</Text>
                            </Pressable>
                        ))}

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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
