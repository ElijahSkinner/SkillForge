// app/(tabs)/glossary/index.tsx
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useCert } from '@/context/CertContext';
import { GLOSSARY } from '../../../constants/glossary';
import {SafeAreaView} from "react-native-safe-area-context";
export default function GlossaryScreen() {
    const { selectedCert } = useCert();

    if (!selectedCert) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please select a certification first.</Text>
            </View>
        );
    }

    const terms = GLOSSARY[selectedCert] ?? [];

    return (
        
        <View style={styles.container}>
            <FlatList
                data={terms}
                keyExtractor={(item) => item.term}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.term}>{item.term}</Text>
                        <Text style={styles.definition}>{item.definition}</Text>
                    </View>
                )}
            />
        </View>
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
