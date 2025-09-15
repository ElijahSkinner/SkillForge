// app/(tabs)/glossary/index.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useCert } from '@/context/CertContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Flashcards from './Flashcards';
import {
    GLOSSARY_TERMS,
    GLOSSARY_ACRONYMS_BY_OBJECTIVE,
    GLOSSARY_PORTS,
} from '../../../constants/glossary';

const OBJECTIVES = [
    '1.0 Networking Concepts',
    '2.0 Network Implementation',
    '3.0 Network Operations',
    '4.0 Network Security',
    '5.0 Network Troubleshooting',
];

export default function GlossaryScreen() {
    const { selectedCert } = useCert();
    const [tab, setTab] = React.useState<'terms' | 'acronyms' | 'ports'>('terms');
    const [selectedObjective, setSelectedObjective] = React.useState<string | null>(null); // null until clicked

    if (!selectedCert) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please select a certification first.</Text>
            </View>
        );
    }

    // If an objective is selected, we show flashcards
    let flashcards: { term?: string; acronym?: string; port?: string; definition: string }[] = [];
    if (selectedObjective) {
        if (tab === 'terms') {
            flashcards = GLOSSARY_TERMS[selectedCert]?.[selectedObjective] ?? [];
        } else if (tab === 'acronyms') {
            flashcards = GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert]?.[selectedObjective] ?? [];
        } else if (tab === 'ports') {
            flashcards = GLOSSARY_PORTS[selectedCert] ?? [];
        }
    }

    // Render tab buttons
    const renderTabButtons = () => (
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            {['terms', 'acronyms', 'ports'].map((t) => (
                <Pressable
                    key={t}
                    style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: tab === t ? '#27b0b9' : '#444',
                        borderRadius: 8,
                        marginHorizontal: 4,
                    }}
                    onPress={() => {
                        setTab(t as any);
                        setSelectedObjective(t === 'ports' ? 'all_ports' : null);
                    }}
                >
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
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

            {selectedObjective && (
                {showFlashcards && (
                    <Flashcards
                        data={flashcards}
                        onClose={() => setShowFlashcards(false)}
                    />
                )}
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
    card: {
        backgroundColor: '#1f1f1f',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    term: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    definition: {
        color: '#ccc',
        marginTop: 6,
        fontSize: 14,
    },
});
