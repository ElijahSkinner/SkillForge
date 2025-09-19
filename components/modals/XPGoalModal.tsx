// components/modals/XPGoalModal.tsx
import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';

interface XPGoalModalProps {
    visible: boolean;
    onClose: () => void;
    currentGoal: number;
}

export function XPGoalModal({ visible, onClose, currentGoal }: XPGoalModalProps) {
    const { updateProgressField } = useAuth();
    const { theme } = useTheme();

    const [newGoal, setNewGoal] = useState(currentGoal.toString());
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const goalNumber = parseInt(newGoal);

        if (isNaN(goalNumber) || goalNumber < 1) {
            Alert.alert('Invalid Goal', 'Please enter a valid number greater than 0');
            return;
        }

        if (goalNumber > 1000) {
            Alert.alert('Goal Too High', 'Daily XP goal should be realistic (max 1000 XP)');
            return;
        }

        setLoading(true);
        try {
            await updateProgressField('dailyGoalXP', goalNumber);
            Alert.alert('Success', `Daily XP goal updated to ${goalNumber} XP`);
            onClose();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to update XP goal');
        } finally {
            setLoading(false);
        }
    };

    const presetGoals = [25, 50, 100, 150, 200];

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <ThemedText variant="h4" style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}>
                Set Daily XP Goal
            </ThemedText>

            <ThemedText variant="body2" color="textSecondary" style={{
                textAlign: 'center',
                marginBottom: theme.spacing.lg
            }}>
                How much XP do you want to earn each day? This helps track your daily progress.
            </ThemedText>

            {/* Current Goal Input */}
            <View style={{ marginBottom: theme.spacing.lg }}>
                <ThemedText variant="body2" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
                    Daily XP Goal
                </ThemedText>
                <TextInput
                    style={{
                        borderWidth: 1,
                        borderColor: theme.colors.borderColor,
                        backgroundColor: theme.colors.surface,
                        color: theme.colors.text,
                        padding: theme.spacing.md,
                        borderRadius: theme.borderRadius.md,
                        fontSize: 16,
                        textAlign: 'center',
                    }}
                    placeholder="Enter XP goal"
                    placeholderTextColor={theme.colors.textMuted}
                    value={newGoal}
                    onChangeText={setNewGoal}
                    keyboardType="numeric"
                    maxLength={4}
                />
            </View>

            {/* Preset Goals */}
            <ThemedText variant="body2" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
                Quick Select:
            </ThemedText>
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.lg
            }}>
                {presetGoals.map(goal => (
                    <Pressable
                        key={goal}
                        style={{
                            backgroundColor: newGoal === goal.toString()
                                ? theme.colors.primary
                                : theme.colors.surface,
                            paddingHorizontal: theme.spacing.md,
                            paddingVertical: theme.spacing.sm,
                            borderRadius: theme.borderRadius.md,
                            borderWidth: 1,
                            borderColor: theme.colors.borderColor,
                        }}
                        onPress={() => setNewGoal(goal.toString())}
                    >
                        <ThemedText
                            variant="body2"
                            style={{
                                color: newGoal === goal.toString()
                                    ? theme.colors.textOnPrimary
                                    : theme.colors.text
                            }}
                        >
                            {goal} XP
                        </ThemedText>
                    </Pressable>
                ))}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
                <ThemedButton
                    title="Cancel"
                    variant="outline"
                    style={{ flex: 1 }}
                    onPress={onClose}
                />
                <ThemedButton
                    title={loading ? "Saving..." : "Save Goal"}
                    style={{ flex: 1 }}
                    onPress={handleSave}
                    disabled={loading}
                />
            </View>
        </ThemedModal>
    );
}
