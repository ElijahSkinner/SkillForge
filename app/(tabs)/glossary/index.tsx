// app/(tabs)/glossary/index.tsx
import { Picker } from '@react-native-picker/picker';

import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Picker } from 'react-native';
import { useCert } from '@/context/CertContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    GLOSSARY_TERMS,
    GLOSSARY_ACRONYMS_BY_OBJECTIVE,
    GLOSSARY_PORTS,
} from '../../../constants/glossary';

export default function GlossaryScreen() {
    const { selectedCert } = useCert();
    const [tab, setTab] = React.useState<'terms' | 'acronyms' | 'ports'>('terms');
    const [selectedObjective, setSelectedObjective] = React.useState('1.0 Networking Concepts');

    if (!selectedCert) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please select a certification first.</Text>
            </View>
        );
    }

    // Select data based on tab
    let data: { term?: string; acronym?: string; port?: string; definition: string }[] = [];
    if (tab === 'terms') {
        data = GLOSSARY_TERMS[selectedCert] ?? [];
    } else if (tab === 'acronyms') {
        data = GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert]?.[selectedObjective] ?? [];
    } else if (tab === 'ports') {
        data = GLOSSARY_PORTS[selectedCert] ?? [];
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

    // Objective picker for acronyms
    const renderObjectivePicker = () => {
        if (tab !== 'acronyms') return null;
        const objectives = Object.keys(GLOSSARY_ACRONYMS_BY_OBJECTIVE[selectedCert] ?? {});
        return (
            <View style={{ marginBottom: 16, backgroundColor: '#1f1f1f', borderRadius: 8 }}>
                <Picker
                    selectedValue={selectedObjective}
                    onValueChange={(itemValue) => setSelectedObjective(itemValue)}
                    style={{ color: '#fff' }}
                >
                    {objectives.map((obj) => (
                        <Picker.Item key={obj} label={obj} value={obj} />
                    ))}
                </Picker>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderTabButtons()}
            {renderObjectivePicker()}
            <FlatList
                data={data}
                keyExtractor={(item, idx) => item.term || item.acronym || item.port || idx.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.term}>
                            {item.term || item.acronym || item.port}
                        </Text>
                        <Text style={styles.definition}>{item.definition}</Text>
                    </View>
                )}
            />
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
