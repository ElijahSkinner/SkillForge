import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useCert } from '@/context/CertContext';
import { CERTS_ROADMAP } from '../../constants/certs';
import { useRouter } from 'expo-router';

export default function QuizRoadmap() {
    const { selectedCert } = useCert();
    const router = useRouter();

    if (!selectedCert) return <Text style={{ color: '#fff', padding: 20 }}>Select a cert first</Text>;

    const modules = CERTS_ROADMAP[selectedCert];

    return (
        <ScrollView horizontal style={styles.container} contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 10 }}>
            {modules.map((mod) => (
                <Pressable
                    key={mod.id}
                    style={[styles.moduleCard, mod.completed && styles.completedCard]}
                    onPress={() =>
                        router.push({
                            pathname: '/quiz/[cert]/[id]',
                            params: { cert: selectedCert, id: String(mod.id) },
                        })
                    }
                >
                    <Text style={styles.moduleTitle}>{mod.name}</Text>
                    <Text style={styles.statusText}>{mod.completed ? '✅ Completed' : '🔒 Locked'}</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexDirection: 'row', paddingVertical: 20 },
    moduleCard: {
        width: 140,
        height: 100,
        borderRadius: 15,
        backgroundColor: '#1a1b1f',
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    completedCard: { backgroundColor: '#27b0b9' },
    moduleTitle: { color: '#fff', fontWeight: '600', fontSize: 14, textAlign: 'center' },
    statusText: { color: '#fff', fontSize: 12, marginTop: 5 },
});
