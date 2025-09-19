// components/modals/ChangePasswordModal.tsx
import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';

interface ChangePasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ visible, onClose }: ChangePasswordModalProps) {
    const { updatePassword } = useAuth();
    const { theme } = useTheme();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await updatePassword(newPassword, currentPassword);
            Alert.alert('Success', 'Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            onClose();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <ThemedText variant="h4" style={{ marginBottom: theme.spacing.lg }}>
                Change Password
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
                placeholder="Current Password"
                placeholderTextColor={theme.colors.textMuted}
                value={currentPassword}
                onChangeText={setCurrentPassword}
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
                    marginBottom: theme.spacing.md,
                    fontSize: 16,
                }}
                placeholder="New Password"
                placeholderTextColor={theme.colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
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
                placeholder="Confirm New Password"
                placeholderTextColor={theme.colors.textMuted}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
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
                    onPress={handleUpdatePassword}
                    disabled={loading}
                />
            </View>
        </ThemedModal>
    );
}
