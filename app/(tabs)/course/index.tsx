import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCert } from 'context/CertContext';
import { CERTS_ROADMAP } from 'constants/certs';

export default function CourseScreen() {
    const router = useRouter();
    const { setSelectedCert } = useCert();
    const certs = Object.keys(CERTS_ROADMAP);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text style={styles.title}>Select a Certification</Text>

            {certs.map((cert) => (
                <Pressable
                    key={cert}
                    style={styles.certButton}
                    onPress={() => {
                        setSelectedCert(cert);
                        router.push('/(tabs)/quiz');
                    }}
                >
                    <Text style={styles.certButtonText}>{cert}</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0d0e12' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
    certButton: {
        width: '90%',
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#27b0b9',
        marginBottom: 15,
        alignItems: 'center',
    },
    certButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
