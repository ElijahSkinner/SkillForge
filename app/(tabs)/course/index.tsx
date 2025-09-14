import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const CERTS = [
    'CompTIA A+',
    'CompTIA Network+',
    'CompTIA Security+',
    'AWS Certified Cloud Practitioner',
    'Cisco CCNA',
    'Microsoft Azure Fundamentals',
    'Certified Ethical Hacker (CEH)',
    'Google IT Support Professional',
    'PMP (Project Management)',
    'ITIL Foundation',
];

export default function CourseScreen() {
    const router = useRouter();
    const [selectedCert, setSelectedCert] = useState<string | null>(null);
    const [progress, setProgress] = useState(0); // Example progress

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
            <Text style={styles.title}>Choose a Certification</Text>

            {CERTS.map((cert) => (
                <Pressable
                    key={cert}
                    onPress={() => setSelectedCert(cert)}
                    style={[
                        styles.certButton,
                        selectedCert === cert && { borderColor: '#27b0b9', borderWidth: 2 },
                    ]}
                >
                    <Text style={styles.certText}>{cert}</Text>
                </Pressable>
            ))}

            {selectedCert && (
                <View style={styles.startContainer}>
                    <LinearGradient
                        colors={['#27b0b9', '#fbc348']}
                        start={[0, 0]}
                        end={[1, 0]}
                        style={styles.startButton}
                    >
                        <Pressable onPress={() => router.push('/(tabs)/quiz')}>
                            <Text style={styles.startText}>Start Learning {selectedCert}</Text>
                        </Pressable>
                    </LinearGradient>

                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                    </View>
                    <Text style={styles.progressText}>{progress}% Complete</Text>
                </View>
            )}
        </ScrollView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0e12',
        paddingTop: 20,
        width,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fbc348',
        marginBottom: 20,
        textAlign: 'center',
    },
    certButton: {
        width: '90%',
        padding: 15,
        backgroundColor: '#1a1b1f',
        borderRadius: 25,
        marginBottom: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    certText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    startContainer: {
        width: '90%',
        marginTop: 30,
        alignItems: 'center',
    },
    startButton: {
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    startText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    progressBarContainer: {
        width: '100%',
        height: 16,
        backgroundColor: '#333333',
        borderRadius: 999,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#27f9c8',
        borderRadius: 999,
    },
    progressText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
});
