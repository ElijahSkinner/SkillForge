// components/themed/ThemedIconButton.tsx
import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface ThemedIconButtonProps extends PressableProps {
    icon: keyof typeof Ionicons.glyphMap;
    variant?: 'default' | 'filled' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    color?: 'primary' | 'secondary' | 'error' | 'success' | 'text';
}

export function ThemedIconButton({
                                     icon,
                                     variant = 'default',
                                     size = 'medium',
                                     color = 'text',
                                     style,
                                     disabled,
                                     ...props
                                 }: ThemedIconButtonProps) {
    const { theme } = useTheme();

    const sizes = {
        small: { button: 32, icon: 16 },
        medium: { button: 40, icon: 20 },
        large: { button: 48, icon: 24 },
    };

    const colors = {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        error: theme.colors.error,
        success: theme.colors.success,
        text: theme.colors.text,
    };

    const currentSize = sizes[size];
    const iconColor = disabled ? theme.colors.textMuted : colors[color];

    const variants = {
        default: {
            backgroundColor: 'transparent',
        },
        filled: {
            backgroundColor: disabled ? theme.colors.surfaceVariant : colors[color],
        },
        outline: {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: disabled ? theme.colors.borderColor : colors[color],
        },
        ghost: {
            backgroundColor: disabled
                ? theme.colors.surfaceVariant
                : `${colors[color]}20`, // 20% opacity
        },
    };

    return (
        <Pressable
            style={[
                {
                    width: currentSize.button,
                    height: currentSize.button,
                    borderRadius: currentSize.button / 2,
                    justifyContent: 'center' as const,
                    alignItems: 'center' as const,
                    ...variants[variant],
                    opacity: disabled ? 0.5 : 1,
                },
            style
]}
    disabled={disabled}
    {...props}
>
    <Ionicons
        name={icon}
    size={currentSize.icon}
    color={variant === 'filled' && !disabled ? theme.colors.textOnPrimary : iconColor}
    />
    </Pressable>
);
}