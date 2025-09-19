// app/(tabs)/settings/index.tsx
import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
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

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, themeName } = useTheme();

    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    // Modal states
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showThemeModal, setShowThemeModal] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setShowLogoutModal(false);
            router.replace('/(auth)/home');
        } catch (err) {
            console.error('Logout failed:', err);
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
                            <ThemedText variant="body1">Dark Mode</ThemedText>
                            <ThemedSwitch value={darkMode} onValueChange={setDarkMode} />
                        </View>
                    </SettingCard>

                    {/* Preferences Section */}
                    <SectionHeader title="Preferences" />

                    <SettingCard>
                        <View style={styles.settingRow}>
                            <ThemedText variant="body1">Notifications</ThemedText>
                            <ThemedSwitch value={notifications} onValueChange={setNotifications} />
                        </View>
                    </SettingCard>

                    <SettingCard>
                        <Pressable onPress={() => alert('Privacy settings coming soon')}>
                            <View style={styles.settingRow}>
                                <ThemedText variant="body1">Privacy</ThemedText>
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