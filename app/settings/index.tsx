// app/(tabs)/profile/settings/index.tsx
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { notificationService } from '@/services/NotificationService';
import {
    ThemedView,
    ThemedText,
    ThemedSwitch,
} from '@/components/themed';
import {
    ThemeSelectionModal,
    AccountInfoModal,
    ChangeEmailModal,
    ChangePasswordModal,
    LogoutConfirmModal,
} from '@/components/modals';
import { XPGoalModal, ReminderTimeModal } from '@/components/modals/StudyPreferences';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout, progress, updateProgressField } = useAuth();
    const { theme, themeName, isDarkMode, toggleDarkMode } = useTheme();

    // Add null check for theme
    if (!theme || !theme.spacing || !theme.colors) {
        return (
            <View style={{ flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 16 }}>Loading settings...</Text>
            </View>
        );
    }

    // Local state for settings (synced with Appwrite)
    const [notifications, setNotifications] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);

    // Modal states
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showThemeModal, setShowThemeModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showXPGoalModal, setShowXPGoalModal] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);

    // Load settings from Appwrite when progress data is available
    useEffect(() => {
        if (progress) {
            setNotifications(progress.notificationsEnabled ?? true);
            setSoundEnabled(progress.soundEnabled ?? true);
        }
    }, [progress]);

    const handleLogout = async () => {
        try {
            await logout();
            setShowLogoutModal(false);
            router.replace('/(auth)/home');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    // Handle notifications toggle
    const handleNotificationsToggle = async (value: boolean) => {
        setNotifications(value);
        try {
            await updateProgressField('notificationsEnabled', value);

            // Handle notification scheduling based on the toggle
            if (value) {
                // Enable notifications - schedule reminder if time is set
                const reminderTime = progress?.reminderTime || '19:00';
                const soundEnabled = progress?.soundEnabled ?? true;

                const success = await notificationService.scheduleStudyReminder(
                    reminderTime,
                    true,
                    soundEnabled
                );

                if (!success) {
                    Alert.alert(
                        'Permission Required',
                        'Please allow notifications in your device settings to receive study reminders.',
                        [{ text: 'OK' }]
                    );
                }
            } else {
                // Disable notifications - cancel all scheduled reminders
                await notificationService.cancelStudyReminder();
            }
        } catch (error) {
            console.error('Failed to update notifications setting:', error);
            // Revert on error
            setNotifications(!value);
        }
    };

    // Handle sound toggle
    const handleSoundToggle = async (value: boolean) => {
        setSoundEnabled(value);
        try {
            await updateProgressField('soundEnabled', value);
        } catch (error) {
            console.error('Failed to update sound setting:', error);
            // Revert on error
            setSoundEnabled(!value);
        }
    };

    const getThemeDisplayName = (theme: string) => {
        return theme.charAt(0).toUpperCase() + theme.slice(1);
    };

    const getThemeIcon = (theme: string) => {
        const icons = {
            forge: 'hammer' as const,
            space: 'rocket' as const,
            ocean: 'water' as const
        };
        return icons[theme as keyof typeof icons] || 'color-palette' as const;
    };

    return (
        <ThemedView variant="background" style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        padding: theme.spacing.lg
                    }}
                >
                    <ThemedText variant="h2" style={{ marginBottom: theme.spacing.lg }}>
                        Settings
                    </ThemedText>

                    {/* Account Section */}
                    <SectionHeader title="Account" />

                    <SettingCard>
                        <Pressable onPress={() => setShowAccountModal(true)}>
                            <View style={styles.settingRow}>
                                <View style={{ flex: 1 }}>
                                    <ThemedText variant="body1">Account Information</ThemedText>
                                    <ThemedText variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                                        {user?.email}
                                        {!user?.emailVerification && ' (Unverified)'}
                                    </ThemedText>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                            </View>
                        </Pressable>
                    </SettingCard>

                    {/* Appearance Section */}
                    <SectionHeader title="Appearance" />

                    <SettingCard>
                        <Pressable style={styles.settingRow} onPress={() => setShowThemeModal(true)}>
                            <View style={{ flex: 1 }}>
                                <ThemedText variant="body1">Theme</ThemedText>
                                <ThemedText variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                                    {getThemeDisplayName(themeName)}
                                </ThemedText>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons
                                    name={getThemeIcon(themeName)}
                                    size={20}
                                    color={theme.colors.primary}
                                    style={{ marginRight: theme.spacing.sm }}
                                />
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                            </View>
                        </Pressable>
                    </SettingCard>

                    <SettingCard>
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <ThemedText variant="body1">Dark Mode</ThemedText>
                                <ThemedText variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                                    {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                                </ThemedText>
                            </View>
                            <ThemedSwitch value={isDarkMode} onValueChange={toggleDarkMode} />
                        </View>
                    </SettingCard>

                    {/* Preferences Section */}
                    <SectionHeader title="Preferences" />

                    <SettingCard>
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <ThemedText variant="body1">Notifications</ThemedText>
                                <ThemedText variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                                    Push notifications and reminders
                                </ThemedText>
                            </View>
                            <ThemedSwitch value={notifications} onValueChange={handleNotificationsToggle} />
                        </View>
                    </SettingCard>

                    <SettingCard>
                        <View style={styles.settingRow}>
                            <View style={{ flex: 1 }}>
                                <ThemedText variant="body1">Sound Effects</ThemedText>
                                <ThemedText variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                                    App sounds and audio feedback
                                </ThemedText>
                            </View>
                            <ThemedSwitch value={soundEnabled} onValueChange={handleSoundToggle} />
                        </View>
                    </SettingCard>

                    <SettingCard>
                        <Pressable onPress={() => alert('Privacy settings coming soon')}>
                            <View style={styles.settingRow}>
                                <View style={{ flex: 1 }}>
                                    <ThemedText variant="body1">Privacy</ThemedText>
                                    <ThemedText variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                                        Data and privacy controls
                                    </ThemedText>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                            </View>
                        </Pressable>
                    </SettingCard>

                    {/* Study Preferences */}
                    <SectionHeader title="Study Preferences" />

                    <SettingCard>
                        <Pressable onPress={() => setShowXPGoalModal(true)}>
                            <View style={styles.settingRow}>
                                <View style={{ flex: 1 }}>
                                    <ThemedText variant="body1">Daily XP Goal</ThemedText>
                                    <ThemedText variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                                        {progress?.dailyGoalXP || 50} XP per day
                                    </ThemedText>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                            </View>
                        </Pressable>
                    </SettingCard>

                    <SettingCard>
                        <Pressable onPress={() => setShowReminderModal(true)}>
                            <View style={styles.settingRow}>
                                <View style={{ flex: 1 }}>
                                    <ThemedText variant="body1">Study Reminder</ThemedText>
                                    <ThemedText variant="body2" color="textSecondary" style={{ marginTop: 2 }}>
                                        Daily at {progress?.reminderTime || '4:20 PM'}
                                    </ThemedText>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
                            </View>
                        </Pressable>
                    </SettingCard>

                    {/* Logout Button */}
                    <View style={{ marginTop: theme.spacing.xl }}>
                        <Pressable
                            style={{
                                backgroundColor: theme.colors.error,
                                padding: theme.spacing.md,
                                borderRadius: theme.borderRadius.md,
                                alignItems: 'center',
                            }}
                            onPress={() => setShowLogoutModal(true)}
                        >
                            <ThemedText variant="button" style={{ color: '#fff' }}>
                                Logout
                            </ThemedText>
                        </Pressable>
                    </View>
                </ScrollView>

                {/* All Modals */}
                <ThemeSelectionModal
                    visible={showThemeModal}
                    onClose={() => setShowThemeModal(false)}
                />

                <AccountInfoModal
                    visible={showAccountModal}
                    onClose={() => setShowAccountModal(false)}
                    onChangeEmail={() => setShowEmailModal(true)}
                    onChangePassword={() => setShowPasswordModal(true)}
                />

                <ChangeEmailModal
                    visible={showEmailModal}
                    onClose={() => setShowEmailModal(false)}
                />

                <ChangePasswordModal
                    visible={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                />

                <LogoutConfirmModal
                    visible={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                    onConfirm={handleLogout}
                />

                <XPGoalModal
                    visible={showXPGoalModal}
                    onClose={() => setShowXPGoalModal(false)}
                    currentGoal={progress?.dailyGoalXP || 50}
                />

                <ReminderTimeModal
                    visible={showReminderModal}
                    onClose={() => setShowReminderModal(false)}
                    currentTime={progress?.reminderTime || '16:20'}
                />
            </SafeAreaView>
        </ThemedView>
    );
}

// Helper Components
function SectionHeader({ title }: { title: string }) {
    const { theme } = useTheme();

    return (
        <ThemedText
            variant="h4"
            color="textSecondary"
            style={{
                marginTop: theme.spacing.lg,
                marginBottom: theme.spacing.sm,
                paddingLeft: theme.spacing.xs
            }}
        >
            {title}
        </ThemedText>
    );
}

function SettingCard({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <ThemedView
            variant="card"
            style={{
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.sm,
                ...theme.shadows.small,
            }}
        >
            {children}
        </ThemedView>
    );
}

// Styles
const styles = {
    settingRow: {
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
    },
};