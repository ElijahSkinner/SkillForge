// components/themed/ThemedModal.tsx
import React from 'react';
import { Modal, ModalProps, View, Pressable } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ThemedModalProps extends ModalProps {
    onClose?: () => void;
}

export function ThemedModal({
                                children,
                                onClose,
                                visible,
                                ...props
                            }: ThemedModalProps) {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            {...props}
        >
            <Pressable
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={onClose}
            >
                <Pressable
                    style={{
                        backgroundColor: theme.colors.surface,
                        padding: theme.spacing.lg,
                        borderRadius: theme.borderRadius.lg,
                        width: '80%',
                        maxWidth: 400,
                        ...theme.shadows.large,
                    }}
                    onPress={(e) => e.stopPropagation()}
                >
                    {children}
                </Pressable>
            </Pressable>
        </Modal>
    );
}