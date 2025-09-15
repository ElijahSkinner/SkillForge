// app/(tabs)/glossary/index.tsx
import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import { useCert } from '@/context/CertContext';
import React from 'react';

import { GLOSSARY_TERMS, GLOSSARY_ACRONYMS } from '../../../constants/glossary';
import {SafeAreaView} from "react-native-safe-area-context";
export default function GlossaryScreen() {
    const { selectedCert } = useCert();
    const [tab, setTab] = React.useState<'terms' | 'acronyms'>('terms');
    const data = tab === 'terms'
        ? GLOSSARY_TERMS[selectedCert] ?? []
        : GLOSSARY_ACRONYMS[selectedCert] ?? [];

    if (!selectedCert) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please select a certification first.</Text>
            </View>
        );
    }
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

    //const terms = GLOSSARY[selectedCert] ?? [];

    return (
    <SafeAreaView style={styles.container}>
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item, idx) => tab === 'terms' ? item.term : item.acronym}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.term}>
                            {tab === 'terms' ? item.term : item.acronym}
                        </Text>
                        <Text style={styles.definition}>{item.definition}</Text>
                    </View>
                )}
            />
        </View>
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
