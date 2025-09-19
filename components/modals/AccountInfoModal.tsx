// components/modals/AccountInfoModal.tsx
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';

interface AccountInfoModalProps {
    visible: boolean;
    onClose: () => void;
    onChangeEmail: () => void;
    onChangePassword: () => void;
}

export function AccountInfoModal({
                                     visible,
                                     onClose,
                                     onChangeEmail,
                                     onChangePassword
                                 }: AccountInfoModalProps) {
    const { user, resendVerification } = useAuth();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    const handleResendVerification = async () => {
        setLoading(true);
        try {
            await resendVerification();
            Alert.alert('Success', 'Verification email sent! Please check your inbox.');
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to send verification email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <ThemedText variant="h3" style={{ marginBottom: theme.spacing.lg }}>
                Account Information
            </ThemedText>

            <View style={{ marginBottom: theme.spacing.md }}>
                <ThemedText variant="body2" color="textSecondary">Name</ThemedText>
                <ThemedText variant="body1">{user?.name || 'Not provided'}</ThemedText>
            </View>

            <View style={{ marginBottom: theme.spacing.md }}>
                <ThemedText variant="body2" color="textSecondary">Email</ThemedText>
                <ThemedText variant="body1">{user?.email}</ThemedText>
                {!user?.emailVerification && (
                    <ThemedText variant="caption" color="error">
                        Email not verified
                    </ThemedText>
                )}
            </View>

            <View style={{ marginBottom: theme.spacing.lg }}>
                <ThemedText variant="body2" color="textSecondary">Account Created</ThemedText>
                <ThemedText variant="body1">
                    {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString() : 'Unknown'}
                </ThemedText>
            </View>

            <View style={{ gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
                <ThemedButton
                    title="Change Email"
                    variant="outline"
                    onPress={() => {
                        onClose();
                        onChangeEmail();
                    }}
                />

                <ThemedButton
                    title="Change Password"
                    variant="outline"
                    onPress={() => {
                        onClose();
                        onChangePassword();
                    }}
                />

                {!user?.emailVerification && (
                    <ThemedButton
                        title={loading ? "Sending..." : "Resend Verification Email"}
                        variant="secondary"
                        onPress={handleResendVerification}
                        disabled={loading}
                    />
                )}
            </View>

            <ThemedButton
                title="Close"
                variant="outline"
                onPress={onClose}
            />
        </ThemedModal>
    );
}
