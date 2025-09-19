// components/modals/ThemeSelectionModal.tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { ThemedModal, ThemedText, ThemedButton } from '@/components/themed';

interface ThemeSelectionModalProps {
    visible: boolean;
    onClose: () => void;
}

export function ThemeSelectionModal({ visible, onClose }: ThemeSelectionModalProps) {
    const { theme, themeName, changeTheme, availableThemes } = useTheme();

    const handleThemeChange = async (newTheme: string) => {
        await changeTheme(newTheme as any);
        onClose();
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
        <ThemedModal visible={visible} onClose={onClose}>
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
                    onPress={onClose}
                />
            </View>
        </ThemedModal>
    );
}