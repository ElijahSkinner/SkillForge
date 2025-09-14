import { Image, StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RootHomeScreen() {
    const router = useRouter();
    
    return (
        <LinearGradient
            colors={['#0d0e12', '#27b0b9', '#27f9c8']}
            style={styles.container}
        >
            {/* Logo */}
            <Image
                source={require('@/assets/images/new-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* Welcome Text */}
            <Text style={styles.title}>Welcome to SkillForge!</Text>
            <Text style={styles.subtitle}>
                Learn, practice, and master your tech certifications
            </Text>

            {/* Quick Start Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#da3a2b' }]}
                    onPress={() => router.push('/course')}
                >
                    <Text style={styles.buttonText}>Courses</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#27b0b9' }]}
                    onPress={() => router.push('/quiz')}
                >
                    <Text style={styles.buttonText}>Quiz</Text>
                </TouchableOpacity>
            </View>

        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: width * 0.6,
        height: width * 0.6,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#f0f0f0',
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
        gap: 20,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        color: '#0d0e12',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
