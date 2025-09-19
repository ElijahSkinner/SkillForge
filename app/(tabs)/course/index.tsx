import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useCert } from '@/context/CertContext';
import { CERTS_ROADMAP } from '@/constants/certs';
import {useTheme} from "@/context/ThemeContext";
import ThemedButton from "@/components/ThemedButton";

export default function CourseScreen() {
    const router = useRouter();
    const { setSelectedCert } = useCert();
    const certs = Object.keys(CERTS_ROADMAP);
    const { theme } = useTheme();

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            contentContainerStyle={{ alignItems: 'center', paddingVertical: 20 }}
            >
            <Text style={[theme.typography.title, { color: theme.colors.text, marginBottom: 20 }]}>
                Select a Certification
            </Text>

            {certs.map((cert) => (
                <ThemedButton
                    key={cert}
                    title={cert}
                    onPress={() => {
                        setSelectedCert(cert);
                        router.push("/(tabs)/roadmap");
                    }}
                />
            ))}
        </ScrollView>
    );
}
