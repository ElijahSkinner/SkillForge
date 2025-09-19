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
    ThemedButton,
    ThemedSwitch,
    ThemedModal
} from '@/components/themed';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { theme, themeName, changeTheme, availableThemes } = useTheme();

    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showThemeModal, setShowThemeModal] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setShowLogoutModal(false);
            router.replace('/(auth)/home');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleThemeChange = async (newTheme: string) => {
        await changeTheme(newTheme as any);
        setShowThemeModal(false);
    };

    const getThemeDisplayName = (theme: string) => {
        return theme.charAt(0).toUpperCase() + theme.slice(1);
    };

    const getThemeDescription = (theme: string) => {
        const descriptions = {
            forge: 'Fire and steel - Traditional blacksmith aesthetic',
            space: 'Cosmic exploration - Futuristic space theme',
            ocean: 'Deep sea adventure - Marine exploration theme'
        };
        return descriptions[theme as keyof typeof descriptions] || '';
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

                    {/* Theme Selection */}
                    <SettingCard>
                        <Pressable
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                            onPress={() => setShowThemeModal(true)}
                        >
                            <View style={{ flex: 1 }}>
                                <ThemedText variant="body1">Theme</ThemedText>
                                <ThemedText
                                    variant="body2"
                                    color="textSecondary"
                                    style={{ marginTop: 2 }}
                                >
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
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={theme.colors.textMuted}
                                />
                            </View>
                        </Pressable>
                    </SettingCard>

                    {/* Dark Mode Toggle */}
                    <SettingCard>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <ThemedText variant="body1">Dark Mode</ThemedText>
                            <ThemedSwitch
                                value={darkMode}
                                onValueChange={setDarkMode}
                            />
                        </View>
                    </SettingCard>

                    {/* Notifications Toggle */}
                    <SettingCard>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <ThemedText variant="body1">Notifications</ThemedText>
                            <ThemedSwitch
                                value={notifications}
                                onValueChange={setNotifications}
                            />
                        </View>
                    </SettingCard>

                    {/* Account Settings */}
                    <SettingCard>
                        <Pressable onPress={() => alert('Account Settings coming soon')}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <ThemedText variant="body1">Account</ThemedText>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={theme.colors.textMuted}
                                />
                            </View>
                        </Pressable>
                    </SettingCard>

                    {/* Privacy Settings */}
                    <SettingCard>
                        <Pressable onPress={() => alert('Privacy Settings coming soon')}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <ThemedText variant="body1">Privacy</ThemedText>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={theme.colors.textMuted}
                                />
                            </View>
                        </Pressable>
                    </SettingCard>

                    {/* Logout Button */}
                    <View style={{ marginTop: theme.spacing.xl }}>
                        <ThemedButton
                            title="Logout"
                            variant="danger"
                            onPress={() => setShowLogoutModal(true)}
                        />
                    </View>
                </ScrollView>

                {/* Theme Selection Modal */}
                <ThemedModal
                    visible={showThemeModal}
                    onClose={() => setShowThemeModal(false)}
                >
                    <ThemedText variant="h3" style={{ marginBottom: theme.spacing.lg }}>
                        Choose Theme
                    </ThemedText>

                    {availableThemes.map((themeOption) => (
                        <Pressable
                            key={themeOption}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding: theme.spacing.md,
                                borderRadius: theme.borderRadius.md,
                                marginBottom: theme.spacing.sm,
                                backgroundColor: themeName === themeOption
                                    ? `${theme.colors.primary}20`
                                    : 'transparent',
                                borderWidth: themeName === themeOption ? 1 : 0,
                                borderColor: theme.colors.primary,
                            }}
                            onPress={() => handleThemeChange(themeOption)}
                        >
                            <View style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: theme.colors.primary,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: theme.spacing.md,
                            }}>
                                <Ionicons
                                    name={getThemeIcon(themeOption)}
                                    size={20}
                                    color={theme.colors.textOnPrimary}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <ThemedText variant="body1">
                                    {getThemeDisplayName(themeOption)}
                                </ThemedText>
                                <ThemedText
                                    variant="caption"
                                    color="textSecondary"
                                    style={{ marginTop: 2 }}
                                >
                                    {getThemeDescription(themeOption)}
                                </ThemedText>
                            </View>
                            {themeName === themeOption && (
                                <Ionicons
                                    name="checkmark-circle"
                                    size={24}
                                    color={theme.colors.primary}
                                />
                            )}
                        </Pressable>
                    ))}

                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        marginTop: theme.spacing.lg
                    }}>
                        <ThemedButton
                            title="Cancel"
                            variant="outline"
                            onPress={() => setShowThemeModal(false)}
                        />
                    </View>
                </ThemedModal>

                {/* Logout Confirmation Modal */}
                <ThemedModal
                    visible={showLogoutModal}
                    onClose={() => setShowLogoutModal(false)}
                >
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
                            onPress={() => setShowLogoutModal(false)}
                        />
                        <ThemedButton
                            title="Logout"
                            variant="danger"
                            style={{ flex: 1 }}
                            onPress={handleLogout}
                        />
                    </View>
                </ThemedModal>
            </SafeAreaView>
        </ThemedView>
    );
}

// Helper component for consistent setting cards
function SettingCard({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    return (
        <ThemedView
            variant="card"
            style={{
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.md,
                ...theme.shadows.small,
            }}
        >
            {children}
        </ThemedView>
    );
}