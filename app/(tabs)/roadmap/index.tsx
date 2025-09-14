import React, { useState } from 'react';
import {View, ScrollView, StyleSheet, Text, Pressable} from 'react-native';
import TopBar from '@/components/TopBar';
import { CERTS_ROADMAP } from '@/constants/certs';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import QuizRoadmap from '@/components/QuizRoadmap';
import { ImageBackground } from "react-native";
// @ts-ignore
import path from "@/assets/images/path.png";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RoadmapScreen() {
    const { selectedCert, setSelectedCert } = useCert();
    const router = useRouter();

    if (!selectedCert)
        return <Text style={{ color: '#fff', padding: 20 }}>Select a cert first</Text>;

    const modules = CERTS_ROADMAP[selectedCert];
    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => ({
        id: idx + 1,
        name,
        score: 0, // optional: track progress
    }));

    return (
        <ImageBackground source={path} style={{ flex: 1 }} resizeMode="cover" >
            <SafeAreaView style={{ flex: 1, }}>
            <View style={{ flex: 1 }}>
            <TopBar currentStreak={123} currency={456} selectedCourse={{ id: 0, name: selectedCert }} enrolledCourses={enrolledCourses} />
            <QuizRoadmap />
            <ScrollView contantContainerStyle={{ flexDirection: 'column-reverse', padding: 20 }}>
                {modules.map((mod) => (
                    <View key={mod.id} style={styles.section}>
                        <Text style={styles.sectionTitle}>{mod.name}</Text>
                        <View style={styles.tilesRow}>
                            {/* 5 tiles per module */}
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
                    </View>
                ))}
            </ScrollView>
        </View>
            </SafeAreaView>

        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    tilesRow: { flexDirection: 'row', justifyContent: 'space-between' },
    tile: {
        width: 60,
        height: 60,
        backgroundColor: '#1a1b1f',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedTile: { backgroundColor: '#27b0b9' },
    tileText: { color: '#fff', fontWeight: '600' },
});