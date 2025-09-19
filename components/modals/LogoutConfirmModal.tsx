// components/modals/LogoutConfirmModal.tsx
import React from 'react';
import { View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';

interface LogoutConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function LogoutConfirmModal({ visible, onClose, onConfirm }: LogoutConfirmModalProps) {
    const { user } = useAuth();
    const { theme } = useTheme();

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <ThemedText variant="h4" style={{ marginBottom: theme.spacing.md }}>
                Confirm Logout
            </ThemedText>
            <ThemedText
                variant="body1"
                color="textSecondary"
                style={{
                    marginBottom: theme.spacing.lg,
                    textAlign: 'center'
                }}
            >
                Are you sure you want to logout, {user?.name || 'User'}?
            </ThemedText>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                gap: theme.spacing.md,
            }}>
                <ThemedButton
                    title="Cancel"
                    variant="outline"
                    style={{ flex: 1 }}
                    onPress={onClose}
                />
                <ThemedButton
                    title="Logout"
                    variant="danger"
                    style={{ flex: 1 }}
                    onPress={onConfirm}
                />
            </View>
        </ThemedModal>
    );
}