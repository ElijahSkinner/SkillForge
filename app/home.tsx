import { Image, StyleSheet, View, TouchableOpacity, Text, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/AuthContext"; // adjust import if needed

const { width } = Dimensions.get('window');

export default function RootHomeScreen() {
    const router = useRouter();
    const { login } = useAuth(); // your auth hook
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const checkFirstLaunch = async () => {
            const value = await AsyncStorage.getItem('alreadyLaunched');
            if (value === null) {
                await AsyncStorage.setItem('alreadyLaunched', 'true');
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
                // if logged in, skip straight to roadmap
                router.replace('/roadmap');
            }
        };
        checkFirstLaunch();
    }, []);

    const handleLogin = async () => {
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            router.replace('/roadmap');
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isFirstLaunch === null) return null;

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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {!showForm ? (
                // Splash with login options
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#27b0b9' }]}
                        onPress={() => setShowForm(true)}
                    >
                        <Text style={styles.buttonText}>Login with Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#444' }]}
                        onPress={() => alert("Google login coming soon")}
                    >
                        <Text style={styles.buttonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#555' }]}
                        onPress={() => alert("GitHub login coming soon")}
                    >
                        <Text style={styles.buttonText}>Continue with GitHub</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                // Email/password login form
                <View style={{ width: "100%" }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#888"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowForm(false)}>
                        <Text style={styles.link}>← Back to login options</Text>
                    </TouchableOpacity>
                </View>
            )}
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
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 8,
        marginBottom: 15,
        color: "#fff",
        backgroundColor: "#1e1e1e",
    },
    link: {
        color: "#27b0b9",
        marginTop: 12,
        textAlign: "center",
    },
    error: {
        color: "red",
        marginBottom: 15,
        textAlign: "center",
    },
});
