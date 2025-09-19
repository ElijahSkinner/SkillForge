// components/modals/ReminderTimeModal.tsx
import React, { useState } from 'react';
import {View, Alert, Pressable, ScrollView} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';

interface ReminderTimeModalProps {
    visible: boolean;
    onClose: () => void;
    currentTime: string;
}

export function ReminderTimeModal({ visible, onClose, currentTime }: ReminderTimeModalProps) {
    const { updateProgressField } = useAuth();
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
            await updateProgressField('reminderTime', newTime);
            Alert.alert('Success', `Study reminder set for ${formatTime12Hour(selectedHour, selectedMinute)}`);
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
