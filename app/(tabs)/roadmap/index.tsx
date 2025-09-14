import React, { useState } from 'react';
import {View, ScrollView, StyleSheet, Text, Pressable} from 'react-native';
import TopBar from '@/components/TopBar';
import { CERTS_ROADMAP } from '@/constants/certs';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import QuizRoadmap from '@/components/QuizRoadmap';
export default function RoadmapScreen() {
    const { selectedCert, setSelectedCert } = useCert();
    const router = useRouter();

    if (!selectedCert)
        return <Text style={{ color: '#fff', padding: 20 }}>Select a cert first</Text>;

    const modules = CERTS_ROADMAP[selectedCert];

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
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
            </ScrollView></View>
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