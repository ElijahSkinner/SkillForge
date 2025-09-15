// app/(tabs)/glossary/index.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Dimensions } from 'react-native';
import { useCert } from '@/context/CertContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    GLOSSARY_TERMS,
    GLOSSARY_ACRONYMS_BY_OBJECTIVE,
    GLOSSARY_PORTS,
} from '../../../constants/glossary';

const SCREEN_WIDTH = Dimensions.get('window').width;

const EXAM_OBJECTIVES = [
    '1.0 Networking Concepts',
    '2.0 Network Implementation',
    '3.0 Network Operations',
    '4.0 Network Security',
    '5.0 Network Troubleshooting',
];

export default function GlossaryScreen() {
    const { selectedCert } = useCert();
    const [tab, setTab] = React.useState<'terms' | 'acronyms' | 'ports'>('terms');
    const [selectedObjective, setSelectedObjective] = React.useState<string | null>(null);

    if (!selectedCert) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please select a certification first.</Text>
            </View>
        );
    }

    // Get the data for flashcards
    let flashcards: { term?: string; acronym?: string; port?: string; definition: string }[] = [];
    if (tab === 'terms') {
        flashcards = selectedObjective ? GLOSSARY_TERMS[selectedCert]?.filter(item => item.objective === selectedObjective) ?? [] : [];
    } else if (tab === 'acronyms') {
        flashcards = selectedObjective
            ? GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert]?.[selectedObjective] ?? []
            : [];
    } else if (tab === 'ports') {
        flashcards = selectedObjective ? GLOSSARY_PORTS[selectedCert]?.filter(item => item.objective === selectedObjective) ?? [] : [];
    }

    // If an objective is selected, show flashcards mode
    if (selectedObjective) {
        return (
            <SafeAreaView style={styles.container}>
                <Pressable onPress={() => setSelectedObjective(null)} style={styles.backButton}>
                    <Text style={{ color: '#fff' }}>← Back</Text>
                </Pressable>
                <FlatList
                    data={flashcards}
                    keyExtractor={(item, idx) => item.term || item.acronym || item.port || idx.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.flashcard}>
                            <Text style={styles.term}>{item.term || item.acronym || item.port}</Text>
                            <Text style={styles.definition}>{item.definition}</Text>
                        </View>
                    )}
                />
            </SafeAreaView>
        );
    }

    // Render the 3 tab buttons
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
                    onPress={() => setTab(t as any)}
                >
                    <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                </Pressable>
            ))}
        </View>
    );

    // Render objective cards
    const renderObjectiveCards = () => (
        <View style={{ marginTop: 16 }}>
            {EXAM_OBJECTIVES.map((obj) => (
                <Pressable
                    key={obj}
                    style={styles.objectiveCard}
                    onPress={() => setSelectedObjective(obj)}
                >
                    <Text style={styles.objectiveText}>{obj}</Text>
                </Pressable>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {renderTabButtons()}
            {renderObjectiveCards()}
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
    objectiveCard: {
        backgroundColor: '#1f1f1f',
        width: SCREEN_WIDTH - 32, // full width minus padding
        height: 100,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    objectiveText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    flashcard: {
        backgroundColor: '#1f1f1f',
        borderRadius: 12,
        padding: 24,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    term: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    definition: {
        color: '#ccc',
        fontSize: 16,
        textAlign: 'center',
    },
    backButton: {
        padding: 10,
        marginBottom: 16,
    },
});
