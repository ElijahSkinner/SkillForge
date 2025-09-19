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

// components/modals/ReminderTimeModal.tsx
import React, { useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';
import { notificationService } from '@/services/NotificationService';

interface ReminderTimeModalProps {
    visible: boolean;
    onClose: () => void;
    currentTime: string;
}

export function ReminderTimeModal({ visible, onClose, currentTime }: ReminderTimeModalProps) {
    const { updateProgressField, progress } = useAuth();
    const { theme } = useTheme();

    const [selectedHour, setSelectedHour] = useState(() => {
        const [hour] = currentTime.split(':');
        return parseInt(hour);
    });
    const [selectedMinute, setSelectedMinute] = useState(() => {
        const [, minute] = currentTime.split(':');
        return parseInt(minute);
    });
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        const newTime = `${selectedHour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;

        setLoading(true);
        try {
            // Update time in database
            await updateProgressField('reminderTime', newTime);

            // Schedule/reschedule notification if notifications are enabled
            const notificationsEnabled = progress?.notificationsEnabled ?? true;
            const soundEnabled = progress?.soundEnabled ?? true;

            if (notificationsEnabled) {
                const success = await notificationService.scheduleStudyReminder(
                    newTime,
                    notificationsEnabled,
                    soundEnabled
                );

                if (success) {
                    Alert.alert(
                        'Reminder Set!',
                        `Study reminder set for ${formatTime12Hour(selectedHour, selectedMinute)}. We'll send you a daily notification.`,
                        [{ text: 'Got it!', style: 'default' }]
                    );
                } else {
                    Alert.alert(
                        'Reminder Saved',
                        `Time saved, but we couldn't set up notifications. Please check your notification settings.`,
                        [{ text: 'OK', style: 'default' }]
                    );
                }
            } else {
                Alert.alert(
                    'Reminder Time Saved',
                    `Time saved as ${formatTime12Hour(selectedHour, selectedMinute)}. Enable notifications in settings to receive reminders.`
                );
            }

            onClose();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to update reminder time');
        } finally {
            setLoading(false);
        }
    };

    const formatTime12Hour = (hour: number, minute: number) => {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = [0, 15, 30, 45];
    const commonTimes = [
        { hour: 8, minute: 0, label: '8:00 AM - Morning' },
        { hour: 12, minute: 0, label: '12:00 PM - Lunch' },
        { hour: 17, minute: 0, label: '5:00 PM - After Work' },
        { hour: 19, minute: 0, label: '7:00 PM - Evening' },
        { hour: 21, minute: 0, label: '9:00 PM - Night' },
    ];

    return (
        <ThemedModal visible={visible} onClose={onClose}>
            <ThemedText variant="h4" style={{ marginBottom: theme.spacing.lg, textAlign: 'center' }}>
                Set Study Reminder
            </ThemedText>

            <ThemedText variant="body2" color="textSecondary" style={{
                textAlign: 'center',
                marginBottom: theme.spacing.lg
            }}>
                When would you like to be reminded to study? We'll send you a gentle notification.
            </ThemedText>

            {/* Current Selection Display */}
            <View style={{
                backgroundColor: theme.colors.primary + '20',
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.lg,
                alignItems: 'center',
            }}>
                <ThemedText variant="h3" style={{ color: theme.colors.primary }}>
                    {formatTime12Hour(selectedHour, selectedMinute)}
                </ThemedText>
            </View>

            {/* Quick Time Presets */}
            <ThemedText variant="body2" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
                Popular Times:
            </ThemedText>
            <View style={{ marginBottom: theme.spacing.lg }}>
                {commonTimes.map(time => (
                    <Pressable
                        key={`${time.hour}-${time.minute}`}
                        style={{
                            backgroundColor: selectedHour === time.hour && selectedMinute === time.minute
                                ? theme.colors.primary + '30'
                                : theme.colors.surface,
                            padding: theme.spacing.md,
                            borderRadius: theme.borderRadius.md,
                            marginBottom: theme.spacing.sm,
                            borderWidth: 1,
                            borderColor: selectedHour === time.hour && selectedMinute === time.minute
                                ? theme.colors.primary
                                : theme.colors.borderColor,
                        }}
                        onPress={() => {
                            setSelectedHour(time.hour);
                            setSelectedMinute(time.minute);
                        }}
                    >
                        <ThemedText variant="body1">{time.label}</ThemedText>
                    </Pressable>
                ))}
            </View>

            {/* Custom Time Selectors */}
            <ThemedText variant="body2" color="textSecondary" style={{ marginBottom: theme.spacing.sm }}>
                Custom Time:
            </ThemedText>
            <View style={{
                flexDirection: 'row',
                gap: theme.spacing.md,
                marginBottom: theme.spacing.lg
            }}>
                {/* Hour Selector */}
                <View style={{ flex: 1 }}>
                    <ThemedText variant="caption" color="textSecondary" style={{ marginBottom: theme.spacing.xs }}>
                        Hour
                    </ThemedText>
                    <ScrollView
                        style={{
                            maxHeight: 100,
                            backgroundColor: theme.colors.surface,
                            borderRadius: theme.borderRadius.md,
                            borderWidth: 1,
                            borderColor: theme.colors.borderColor,
                        }}
                        showsVerticalScrollIndicator={false}
                    >
                        {hours.map(hour => (
                            <Pressable
                                key={hour}
                                style={{
                                    padding: theme.spacing.sm,
                                    backgroundColor: selectedHour === hour ? theme.colors.primary + '30' : 'transparent',
                                }}
                                onPress={() => setSelectedHour(hour)}
                            >
                                <ThemedText variant="body2" style={{ textAlign: 'center' }}>
                                    {formatTime12Hour(hour, 0).split(':')[0]} {hour >= 12 ? 'PM' : 'AM'}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Minute Selector */}
                <View style={{ flex: 1 }}>
                    <ThemedText variant="caption" color="textSecondary" style={{ marginBottom: theme.spacing.xs }}>
                        Minutes
                    </ThemedText>
                    <View style={{
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.borderRadius.md,
                        borderWidth: 1,
                        borderColor: theme.colors.borderColor,
                    }}>
                        {minutes.map(minute => (
                            <Pressable
                                key={minute}
                                style={{
                                    padding: theme.spacing.sm,
                                    backgroundColor: selectedMinute === minute ? theme.colors.primary + '30' : 'transparent',
                                }}
                                onPress={() => setSelectedMinute(minute)}
                            >
                                <ThemedText variant="body2" style={{ textAlign: 'center' }}>
                                    :{minute.toString().padStart(2, '0')}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </View>
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
                    title={loading ? "Saving..." : "Set Reminder"}
                    style={{ flex: 1 }}
                    onPress={handleSave}
                    disabled={loading}
                />
            </View>
        </ThemedModal>
    );
}