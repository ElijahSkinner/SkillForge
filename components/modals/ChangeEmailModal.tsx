// components/modals/ChangeEmailModal.tsx
import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';

interface ChangeEmailModalProps {
    visible: boolean;
    onClose: () => void;
}

export function ChangeEmailModal({ visible, onClose }: ChangeEmailModalProps) {
    const { updateEmail } = useAuth();
    const { theme } = useTheme();

    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdateEmail = async () => {
        if (!newEmail || !currentPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await updateEmail(newEmail, currentPassword);
            Alert.alert('Success', 'Email updated successfully! Please verify your new email address.');
            setNewEmail('');
            setCurrentPassword('');
            onClose();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to update email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <ThemedText variant="h4" style={{ marginBottom: theme.spacing.lg }}>
                Change Email Address
            </ThemedText>

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
                placeholder="New Email"
                placeholderTextColor={theme.colors.textMuted}
                value={newEmail}
                onChangeText={setNewEmail}
                keyboardType="email-address"
                autoCapitalize="none"
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
                placeholder="Current Password"
                placeholderTextColor={theme.colors.textMuted}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
            />

            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                <ThemedButton
                    title="Cancel"
                    variant="outline"
                    style={{ flex: 1 }}
                    onPress={onClose}
                />
                <ThemedButton
                    title={loading ? "Updating..." : "Update"}
                    style={{ flex: 1 }}
                    onPress={handleUpdateEmail}
                    disabled={loading}
                />
            </View>
        </ThemedModal>
    );
}
