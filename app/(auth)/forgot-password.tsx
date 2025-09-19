// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedView, ThemedText, ThemedButton } from '@/components/themed';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { forgotPassword } = useAuth();
    const { theme } = useTheme();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        setError("");
        setLoading(true);
        try {
            await forgotPassword(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <ThemedView variant="background" style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, padding: theme.spacing.lg, justifyContent: 'center' }}>
                    <ThemedText variant="h2" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
                        Check Your Email
                    </ThemedText>

                    <ThemedText variant="body1" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
                        We've sent a password reset link to {email}.
                        Please check your inbox and follow the instructions.
                    </ThemedText>

                    <ThemedButton
                        title="← Back to Login"
                        variant="outline"
                        onPress={() => router.replace('/(auth)/home')}
                    />
                </SafeAreaView>
            </ThemedView>
        );
    }

    return (
        <ThemedView variant="background" style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, padding: theme.spacing.lg }}>
                <ThemedText variant="h2" style={{ textAlign: 'center', marginBottom: theme.spacing.md }}>
                    Reset Password
                </ThemedText>

                <ThemedText variant="body2" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
                    Enter your email address and we'll send you a link to reset your password.
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
                        marginBottom: theme.spacing.lg,
                        fontSize: 16,
                    }}
                    placeholder="Email"
                    placeholderTextColor={theme.colors.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <ThemedButton
                    title={loading ? "Sending..." : "Send Reset Email"}
                    onPress={handleForgotPassword}
                    disabled={loading}
                    style={{ marginBottom: theme.spacing.md }}
                />

                <ThemedButton
                    title="← Back to Login"
                    variant="outline"
                    onPress={() => router.back()}
                />
            </SafeAreaView>
        </ThemedView>
    );
}
