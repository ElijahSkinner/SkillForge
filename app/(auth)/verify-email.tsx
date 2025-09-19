// app/(auth)/verify-email.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedView, ThemedText, ThemedButton } from '@/components/themed';

export default function VerifyEmailScreen() {
    const router = useRouter();
    const { userId, secret } = useLocalSearchParams();
    const { verifyEmail, resendVerification } = useAuth();
    const { theme } = useTheme();

    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (userId && secret) {
            handleVerifyEmail();
        }
    }, [userId, secret]);

    const handleVerifyEmail = async () => {
        if (!userId || !secret) return;

        setLoading(true);
        setError("");
        try {
            await verifyEmail(userId as string, secret as string);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || "Email verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setResendLoading(true);
        setError("");
        try {
            await resendVerification();
            setError("Verification email sent! Please check your inbox.");
        } catch (err: any) {
            setError(err.message || "Failed to resend verification email");
        } finally {
            setResendLoading(false);
        }
    };

    if (success) {
        return (
            <ThemedView variant="background" style={{ flex: 1 }}>
                <SafeAreaView style={{ flex: 1, padding: theme.spacing.lg, justifyContent: 'center' }}>
                    <ThemedText variant="h2" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
                        Email Verified!
                    </ThemedText>

                    <ThemedText variant="body1" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
                        Your email has been successfully verified. You can now access all features of SkillForge.
                    </ThemedText>

                    <ThemedButton
                        title="Continue to App"
                        onPress={() => router.replace('/(tabs)/roadmap')}
                    />
                </SafeAreaView>
            </ThemedView>
        );
    }

    return (
        <ThemedView variant="background" style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1, padding: theme.spacing.lg, justifyContent: 'center' }}>
                <ThemedText variant="h2" style={{ textAlign: 'center', marginBottom: theme.spacing.lg }}>
                    Verify Your Email
                </ThemedText>

                {loading ? (
                    <ThemedText variant="body1" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
                        Verifying your email...
                    </ThemedText>
                ) : (
                    <ThemedText variant="body1" color="textSecondary" style={{ textAlign: 'center', marginBottom: theme.spacing.xl }}>
                        Please check your email and click the verification link, or resend a new verification email.
                    </ThemedText>
                )}

                {error ? (
                    <View style={{
                        backgroundColor: error.includes("sent") ? theme.colors.success : theme.colors.error,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.md,
                        marginBottom: theme.spacing.lg
                    }}>
                        <ThemedText style={{ color: '#fff', textAlign: 'center' }}>
                            {error}
                        </ThemedText>
                    </View>
                ) : null}

                <ThemedButton
                    title={resendLoading ? "Sending..." : "Resend Verification Email"}
                    onPress={handleResendVerification}
                    disabled={resendLoading}
                    style={{ marginBottom: theme.spacing.md }}
                />

                <ThemedButton
                    title="← Back to Home"
                    variant="outline"
                    onPress={() => router.replace('/(auth)/home')}
                />
            </SafeAreaView>
        </ThemedView>
    );
}