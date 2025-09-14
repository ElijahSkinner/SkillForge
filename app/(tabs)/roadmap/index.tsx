import React from 'react';
import { View, ScrollView, StyleSheet, Text, Pressable, ImageBackground } from 'react-native';
import TopBar from '@/components/TopBar';
import { CERTS_ROADMAP } from '@/constants/certs';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import QuizRoadmap from '@/components/QuizRoadmap';
import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import path from '@/assets/images/path.png';

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();

    if (!selectedCert)
        return <Text style={{ color: '#fff', padding: 20 }}>Select a cert first</Text>;

    const modules = CERTS_ROADMAP[selectedCert];

    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => ({
        id: idx + 1,
        name,
        score: 0,
    }));

    return (
        <ImageBackground
            source={path}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {/* TopBar with enrolled courses */}
                    <TopBar
                        currentStreak={123}
                        currency={456}
                        selectedCourse={{ id: 0, name: selectedCert }}
                        enrolledCourses={enrolledCourses}
                    />

                    {/* Optional Quiz Roadmap overview */}
                    <QuizRoadmap />

                    {/* ScrollView with bottom-to-top scroll */}
                    <ScrollView
                        contentContainerStyle={{
                            flexDirection: 'column-reverse',
                            paddingVertical: 20,
                            alignItems: 'center',
                        }}
                    >
                        {modules.map((mod) => (
                            <View key={mod.id} style={styles.section}>
                                {/* Exam Objective */}
                                <Text style={styles.sectionTitle}>{mod.name}</Text>

                                {/* Module Tiles */}
                                <View style={styles.tilesColumn}>
                                    {[...Array(5)].map((_, idx) => (
                                        <Pressable
                                            key={idx}
                                            style={[styles.tile, mod.completed && styles.completedTile]}
                                            onPress={() =>
                                                router.push({
                                                    pathname: '/quiz/[cert]/[id]',
                                                    params: { cert: selectedCert, id: String(mod.id) },
                                                })
                                            }
                                        >
                                            <Text style={styles.tileText}>{idx + 1}</Text>
                                        </Pressable>
                                    ))}
                                </View>

                                {/* Inclusive Quiz for this objective */}
                                <Pressable
                                    style={styles.quizTile}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/quiz/[cert]/[id]',
                                            params: { cert: selectedCert, id: `quiz-${mod.id}` },
                                        })
                                    }
                                >
                                    <Text style={styles.quizText}>Quiz: {mod.name}</Text>
                                </Pressable>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    tilesColumn: { flexDirection: 'column', marginBottom: 12 },
    tile: {
        width: 60,
        height: 60,
        backgroundColor: '#1a1b1f',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    completedTile: { backgroundColor: '#27b0b9' },
    tileText: { color: '#fff', fontWeight: '600' },
    quizTile: {
        height: 50,
        backgroundColor: '#444',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    quizText: { color: '#fff', fontWeight: '700' },
});
