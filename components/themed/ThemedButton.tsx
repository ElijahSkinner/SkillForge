// components/themed/ThemedButton.tsx
import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ThemedButtonProps extends PressableProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'small' | 'medium' | 'large';
}

export function ThemedButton({
                                 title,
                                 variant = 'primary',
                                 size = 'medium',
                                 style,
                                 ...props
                             }: ThemedButtonProps) {
    const { theme } = useTheme();

    const buttonStyles = {
        primary: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        secondary: {
            backgroundColor: theme.colors.secondary,
            borderColor: theme.colors.secondary,
        },
        outline: {
            backgroundColor: 'transparent',
            borderColor: theme.colors.primary,
            borderWidth: 1,
        },
        danger: {
            backgroundColor: theme.colors.error,
            borderColor: theme.colors.error,
        },
    };

    const textColors = {
        primary: theme.colors.textOnPrimary,
        secondary: theme.colors.text,
        outline: theme.colors.primary,
        danger: theme.colors.text,
    };

    const sizes = {
        small: { paddingVertical: 8, paddingHorizontal: 16 },
        medium: { paddingVertical: 12, paddingHorizontal: 20 },
        large: { paddingVertical: 16, paddingHorizontal: 24 },
    };

    return (
        <Pressable
            style={[
                {
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: theme.borderRadius.md,
                    ...buttonStyles[variant],
                    ...sizes[size],
                },
               // style
            ]}
            {...props}
        >
            <Text
                style={[
                    theme.typography.button,
                    { color: textColors[variant] }
                ]}
            >
                {title}
            </Text>
        </Pressable>
    );
}