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
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/TopBar';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import { CERTS_ROADMAP } from '@/constants/certs';
import path from '@/assets/images/path.png';

const { TILE_SIZE, TILE_SPACING } = { TILE_SIZE: 60, TILE_SPACING: 8 };

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);

    const [selectedTile, setSelectedTile] = useState<any | null>(null);

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
        <ImageBackground source={path} style={{ flex: 1 }} resizeMode="cover">
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
                                onPress={() =>
                                    setSelectedTile({
                                        type: 'quiz',
                                        moduleName: mod.name,
                                        xp: mod.unitReviewXP,
                                        info: 'Unit Review / Quiz info',
                                    })
                                }
                            >
                                <Text style={styles.tileText}>Q</Text>
                            </Pressable>

                            {/* Lesson Tiles */}
                            {mod.lessons.map((lesson, index) => (
                                <Pressable
                                    key={`${mod.id}-${index}`}
                                    style={[styles.lessonTile, { backgroundColor: mod.completed ? '#27b0b9' : '#1a1b1f' }]}
                                    onPress={() =>
                                        setSelectedTile({
                                            type: 'lesson',
                                            moduleName: mod.name,
                                            lessonNumber: index + 1,
                                            lessonName: lesson.name,
                                            xp: lesson.xp,
                                        })
                                    }
                                >
                                    <Text style={styles.tileText}>{index + 1}</Text>
                                </Pressable>
                            ))}

                            {/* Module Name */}
                            <Text style={styles.sectionTitle}>{mod.name}</Text>
                        </View>
                    ))}
                </Animated.ScrollView>

                {/* Tile Details Modal */}
                <Modal
                    visible={!!selectedTile}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setSelectedTile(null)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {selectedTile?.type === 'quiz' ? (
                                <>
                                    <Text style={styles.modalTitle}>{selectedTile.moduleName} - Unit Review</Text>
                                    <Text style={styles.modalText}>XP: {selectedTile.xp}</Text>
                                    <Text style={styles.modalText}>{selectedTile.info}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.modalTitle}>
                                        {selectedTile.moduleName} - Lesson {selectedTile.lessonNumber}
                                    </Text>
                                    <Text style={styles.modalText}>{selectedTile.lessonName}</Text>
                                    <Text style={styles.modalText}>XP: {selectedTile.xp}</Text>
                                </>
                            )}
                            <Pressable style={styles.closeButton} onPress={() => setSelectedTile(null)}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
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
        color: '#fee37f',
    },
    tileText: { color: '#fff', fontWeight: '600' },
    container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', padding: 16 },
    message: { color: '#aaa', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    button: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#27b0b9', borderRadius: 8 },
    qTile: { width: TILE_SIZE, height: TILE_SIZE, borderRadius: 12, marginBottom: TILE_SPACING, justifyContent: 'center', alignItems: 'center', backgroundColor: '#444' },
    lessonTile: { width: TILE_SIZE, height: TILE_SIZE, marginBottom: TILE_SPACING, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#1e1e1e', padding: 16, borderRadius: 12, width: 250 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8, textAlign: 'center' },
    modalText: { color: '#fff', fontSize: 16, marginBottom: 6, textAlign: 'center' },
    closeButton: { marginTop: 12, backgroundColor: '#27b0b9', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
});
