// components/CourseRedirect.tsx
import { Pressable, Text, View, StyleSheet } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useCert } from "@/context/CertContext";

export default function CourseRedirect() {
    const router = useRouter();
    const { selectedCert } = useCert();

    if (selectedCert) return null; // nothing to show if cert is selected

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Please select a certification first.</Text>
            <Pressable
                style={styles.button}
                onPress={() => router.push('/course')} // adjust route if needed
            >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Select a Cert</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    message: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#27b0b9',
        borderRadius: 8,
    },
});
