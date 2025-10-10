// components/modals/QuizExitModal.tsx
import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '../themed';

interface QuizExitModalProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function QuizExitModal({
                                          visible,
                                          onConfirm,
                                          onCancel
                                      }: QuizExitModalProps) {
    const { theme } = useTheme();

    return (
        <ThemedModal visible={visible} onClose={onCancel}>
            <View style={{ alignItems: 'center' }}>
                {/* Warning Icon */}
                <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: theme.colors.warning + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: theme.spacing.lg
                }}>
                    <Ionicons
                        name="warning"
                        size={40}
                        color={theme.colors.warning}
                    />
                </View>

                {/* Title */}
                <ThemedText variant="h3" style={{
                    marginBottom: theme.spacing.sm,
                    textAlign: 'center'
                }}>
                    Exit Quiz?
                </ThemedText>

                {/* Description */}
                <ThemedText variant="body1" color="textSecondary" style={{
                    textAlign: 'center',
                    marginBottom: theme.spacing.xl,
                    lineHeight: 24
                }}>
                    Your progress will not be saved. Are you sure you want to leave?
                </ThemedText>

                {/* Action Buttons */}
                <View style={{ width: '100%', gap: theme.spacing.md }}>
                    <ThemedButton
                        title="Exit Quiz"
                        variant="danger"
                        onPress={onConfirm}
                    />
                    <ThemedButton
                        title="Stay & Continue"
                        variant="outline"
                        onPress={onCancel}
                    />
                </View>
            </View>
        </ThemedModal>
    );
}