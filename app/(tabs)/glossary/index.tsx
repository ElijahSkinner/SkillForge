import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCert } from '@/context/CertContext';
import { GLOSSARY_TERMS, GLOSSARY_ACRONYMS } from '@/constants/glossary';

type GlossaryItem =
    | { term: string; definition: string }
    | { acronym: string; definition: string };

export default function GlossaryScreen() {
    const { selectedCert } = useCert();
    const [tab, setTab] = React.useState<'terms' | 'acronyms'>('terms');

    if (!selectedCert) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please select a certification first.</Text>
            </View>
        );
    }

    const data: GlossaryItem[] =
        tab === 'terms'
            ? GLOSSARY_TERMS[selectedCert] ?? []
            : GLOSSARY_ACRONYMS[selectedCert] ?? [];

    return (
        <SafeAreaView style={styles.container}>
            {/* Tab Buttons */}
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                <Pressable
                    style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: tab === 'terms' ? '#27b0b9' : '#444',
                        borderRadius: 8,
                        marginRight: 4,
                    }}
                    onPress={() => setTab('terms')}
                >
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Terms</Text>
                </Pressable>
                <Pressable
                    style={{
                        flex: 1,
                        padding: 10,
                        backgroundColor: tab === 'acronyms' ? '#27b0b9' : '#444',
                        borderRadius: 8,
                        marginLeft: 4,
                    }}
                    onPress={() => setTab('acronyms')}
                >
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Acronyms</Text>
                </Pressable>
            </View>

            {/* List */}
            <FlatList
                data={data}
                keyExtractor={(item, idx) =>
                    'term' in item ? item.term : item.acronym
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.term}>
                            {'term' in item ? item.term : item.acronym}
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
