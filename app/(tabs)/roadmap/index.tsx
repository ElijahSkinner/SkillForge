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

    const [selectedModule, setSelectedModule] = useState<any | null>(null);

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
                                onPress={() => setSelectedModule(mod)}
                            >
                                <Text style={styles.tileText}>Q</Text>
                            </Pressable>

                            {/* Lesson Tiles */}
                            {[...mod.lessons].reverse().map((lesson, index) => {
                                const number = mod.lessons.length - index;
                                return (
                                    <Pressable
                                        key={`${mod.id}-${number}`}
                                        style={[styles.lessonTile, { backgroundColor: mod.completed ? '#27b0b9' : '#1a1b1f' }]}
                                        onPress={() => setSelectedModule(mod)}
                                    >
                                        <Text style={styles.tileText}>{number}</Text>
                                    </Pressable>
                                );
                            })}

                            {/* Module Name */}
                            <Text style={styles.sectionTitle}>{mod.name}</Text>
                        </View>
                    ))}
                </Animated.ScrollView>

                {/* Module Details Modal */}
                <Modal visible={!!selectedModule} transparent animationType="slide" onRequestClose={() => setSelectedModule(null)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedModule?.name}</Text>
                            <ScrollView style={{ width: '100%' }}>
                                {selectedModule?.lessons.map((lesson: any, idx: number) => (
                                    <View key={idx} style={styles.lessonRow}>
                                        <Text style={styles.lessonNumber}>{idx + 1}</Text>
                                        <Text style={styles.lessonName}>{lesson.name}</Text>
                                        <Text style={styles.lessonXP}>{lesson.xp} XP</Text>
                                    </View>
                                ))}
                            </ScrollView>
                            <Pressable style={styles.closeButton} onPress={() => setSelectedModule(null)}>
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
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' },
    modalContent: { backgroundColor: '#1e1e1e', padding: 20, borderRadius: 12, width: '85%', maxHeight: '80%' },
    modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 15, textAlign: 'center' },
    lessonRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#333' },
    lessonNumber: { color: '#27b0b9', fontWeight: 'bold', width: 24 },
    lessonName: { color: '#fff', flex: 1, marginLeft: 8 },
    lessonXP: { color: '#fee37f', fontWeight: 'bold' },
    closeButton: { marginTop: 20, backgroundColor: '#27b0b9', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
});
