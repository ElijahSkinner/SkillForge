// app/(tabs)/glossary/index.tsx
import { useTheme} from '@/context/ThemeContext';
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useCert } from '@/context/CertContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Flashcards from './Flashcards';
import {
    GLOSSARY_TERMS,
    GLOSSARY_ACRONYMS_BY_OBJECTIVE,
    GLOSSARY_PORTS,
} from '@/constants/glossary';
import CourseRedirect from '@/components/CourseRedirect';
const OBJECTIVES = [
    '1.0 Networking Concepts',
    '2.0 Network Implementation',
    '3.0 Network Operations',
    '4.0 Network Security',
    '5.0 Network Troubleshooting',
];

export default function GlossaryScreen() {
    const { selectedCert } = useCert();
    const { theme } = useTheme();
    const [tab, setTab] = useState<'terms' | 'acronyms' | 'ports'>('terms');
    const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
    const [showFlashcards, setShowFlashcards] = useState(false);
    const [flashcards, setFlashcards] = useState<
        { term?: string; acronym?: string; port?: string; definition: string }[]
    >([]);

    // Update flashcards whenever selectedObjective or tab changes
    useEffect(() => {
        if (!selectedCert) return;

        if (tab === 'terms' && selectedObjective) {
            setFlashcards(GLOSSARY_TERMS[selectedCert]?.[selectedObjective] ?? []);
            setShowFlashcards(true);
        } else if (tab === 'acronyms' && selectedObjective) {
            setFlashcards(GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert]?.[selectedObjective] ?? []);
            setShowFlashcards(true);
        } else if (tab === 'ports') {
            setFlashcards(GLOSSARY_PORTS[selectedCert] ?? []);
            setShowFlashcards(true);
            setSelectedObjective('all_ports'); // optional
        }
    }, [tab, selectedObjective, selectedCert]);

    if (!selectedCert) {
        return (
            <CourseRedirect />
        );
    }

    // Tab buttons
    const renderTabButtons = () => (
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            {['terms', 'acronyms', 'ports'].map((t) => (
                <Pressable
                    key={t}
                    style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: theme.colors.cardBackground,
                        borderRadius: 8,
                        marginHorizontal: theme.borderRadius.xl,
                    }}
                    onPress={() => {
                        setTab(t as any);
                        setSelectedObjective(t === 'ports' ? 'all_ports' : null);
                    }}
                >
                    <Text style={{ color: theme.colors, textAlign: 'center', fontWeight: 'bold' }}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                </Pressable>
            ))}
        </View>
    );

    // Render 5 objective cards for Terms / Acronyms
    const renderObjectiveCards = () => {
        if (tab === 'ports' || selectedObjective) return null;
        return (
            <View style={{ marginBottom: 16 }}>
                {OBJECTIVES.map((obj) => (
                    <Pressable
                        key={obj}
                        style={{
                            height: 120,
                            backgroundColor: '#1f1f1f',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 12,
                            borderRadius: 12,
                        }}
                        onPress={() => setSelectedObjective(obj)}
                    >
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                            {obj}
                        </Text>
                    </Pressable>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderTabButtons()}
            {renderObjectiveCards()}

            {showFlashcards && selectedObjective && (
                <Flashcards data={flashcards} onClose={() => setShowFlashcards(false)} />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    message: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
});
