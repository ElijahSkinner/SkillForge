// app/(auth)/register.tsx
import React, { useState } from 'react';
import { View, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedView, ThemedText, ThemedButton } from '@/components/themed';

export default function RegisterScreen() {
    const router = useRouter();
    const { register } = useAuth();
    const { theme } = useTheme();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        setError("");
        setLoading(true);
        try {
            await register(email, password, name);
            router.replace('/(tabs)/roadmap');
        } catch (err: any) {
            setError(err.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedView variant="background" style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, padding: theme.spacing.lg }}>
                <ThemedText variant="h2" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
                    Create Account
                </ThemedText>

                {error ? (
                    <View style={{
                        backgroundColor: theme.colors.error,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.md,
                        marginBottom: theme.spacing.md
                    }}>
                        <ThemedText style={{ color: '#fff', textAlign: 'center' }}>
                            {error}
                        </ThemedText>
                    </View>
                ) : null}

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.md,
                        marginBottom: theme.spacing.md,
                        fontSize: 16,
                    }}
                    placeholder="Full Name"
                    placeholderTextColor={theme.colors.textMuted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                />

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.md,
                        marginBottom: theme.spacing.md,
                        fontSize: 16,
                    }}
                    placeholder="Email"
                    placeholderTextColor={theme.colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.md,
                        marginBottom: theme.spacing.md,
                        fontSize: 16,
                    }}
                    placeholder="Password"
                    placeholderTextColor={theme.colors.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.md,
                        marginBottom: theme.spacing.lg,
                        fontSize: 16,
                    }}
                    placeholder="Confirm Password"
                    placeholderTextColor={theme.colors.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />

                <ThemedButton
                    title={loading ? "Creating Account..." : "Create Account"}
                    onPress={handleRegister}
                    disabled={loading}
                    style={{ marginBottom: theme.spacing.md }}
                />

                <ThemedButton
                    title="← Back to Home"
                    variant="outline"
                    onPress={() => router.back()}
                />
            </SafeAreaView>
        </ThemedView>
    );
}
