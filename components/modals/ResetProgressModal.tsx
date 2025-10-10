// components/modals/ResetProgressModal.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '../themed';

interface ResetProgressModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export function ResetProgressModal({
                                       visible,
                                       onClose,
                                       onConfirm,
                                       loading = false
                                   }: ResetProgressModalProps) {
    const { theme } = useTheme();
    const [step, setStep] = useState<'warning' | 'confirmation'>('warning');

    const handleClose = () => {
        setStep('warning');
        onClose();
    };

    const handleProceed = () => {
        if (step === 'warning') {
            setStep('confirmation');
        } else {
            onConfirm();
            setStep('warning');
        }
    };

    const handleBack = () => {
        setStep('warning');
    };

    return (
        <ThemedModal visible={visible} onClose={handleClose}>
            <View style={{ alignItems: 'center' }}>
                {/* Warning Icon */}
                <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: theme.colors.error + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: theme.spacing.lg
                }}>
                    <Ionicons
                        name="warning"
                        size={40}
                        color={theme.colors.error}
                    />
                </View>

                {step === 'warning' ? (
                    <>
                        {/* First Warning */}
                        <ThemedText variant="h3" style={{
                            marginBottom: theme.spacing.sm,
                            textAlign: 'center',
                            color: theme.colors.error
                        }}>
                            Reset All Progress?
                        </ThemedText>

                        <ThemedText variant="body1" color="textSecondary" style={{
                            textAlign: 'center',
                            marginBottom: theme.spacing.lg,
                            lineHeight: 24
                        }}>
                            This will permanently delete:
                        </ThemedText>

                        <View style={{
                            backgroundColor: theme.colors.surface,
                            padding: theme.spacing.md,
                            borderRadius: theme.borderRadius.md,
                            width: '100%',
                            marginBottom: theme.spacing.xl,
                            borderLeftWidth: 4,
                            borderLeftColor: theme.colors.error
                        }}>
                            <ThemedText variant="body2" style={{ marginBottom: theme.spacing.xs }}>
                                • All completed lessons and modules
                            </ThemedText>
                            <ThemedText variant="body2" style={{ marginBottom: theme.spacing.xs }}>
                                • All quiz scores and completions
                            </ThemedText>
                            <ThemedText variant="body2" style={{ marginBottom: theme.spacing.xs }}>
                                • Your XP and streak history
                            </ThemedText>
                            <ThemedText variant="body2" style={{ marginBottom: theme.spacing.xs }}>
                                • All achievements and badges
                            </ThemedText>
                            <ThemedText variant="body2">
                                • Study time and statistics
                            </ThemedText>
                        </View>

                        <View style={{ width: '100%', gap: theme.spacing.md }}>
                            <ThemedButton
                                title="I Understand, Continue"
                                variant="danger"
                                onPress={handleProceed}
                            />
                            <ThemedButton
                                title="Cancel"
                                variant="outline"
                                onPress={handleClose}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        {/* Final Confirmation */}
                        <ThemedText variant="h3" style={{
                            marginBottom: theme.spacing.sm,
                            textAlign: 'center',
                            color: theme.colors.error
                        }}>
                            Are You Absolutely Sure?
                        </ThemedText>

                        <ThemedText variant="body1" color="textSecondary" style={{
                            textAlign: 'center',
                            marginBottom: theme.spacing.xl,
                            lineHeight: 24
                        }}>
                            This action cannot be undone. All your learning progress will be permanently erased.
                        </ThemedText>

                        <View style={{ width: '100%', gap: theme.spacing.md }}>
                            <ThemedButton
                                title={loading ? "Resetting..." : "Yes, Reset Everything"}
                                variant="danger"
                                onPress={handleProceed}
                                disabled={loading}
                            />
                            <ThemedButton
                                title="Go Back"
                                variant="outline"
                                onPress={handleBack}
                                disabled={loading}
                            />
                        </View>
                    </>
                )}
            </View>
        </ThemedModal>
    );
}