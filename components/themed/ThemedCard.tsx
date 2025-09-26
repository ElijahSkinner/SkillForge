import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ThemedCardProps extends PressableProps {
    variant?: 'default' | 'elevated' | 'flashcard' | 'flashcard-flipped';
    children: React.ReactNode;
}

export function ThemedCard({
                               variant = 'default',
                               children,
                               style,
                               ...props
                           }: ThemedCardProps) {
    const { theme } = useTheme();

    const cardStyles = {
        default: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1,
            borderColor: theme.colors.borderColor,
            ...theme.shadows.small,
        },
        elevated: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.borderColor,
            ...theme.shadows.large,
        },
        flashcard: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            borderWidth: 2,
            borderColor: theme.colors.borderColor,
            ...theme.shadows.large,
            minHeight: 350,
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const,
            padding: theme.spacing.xl,
        },
        'flashcard-flipped': {
            backgroundColor: theme.colors.primary,
            borderRadius: theme.borderRadius.xl,
            borderWidth: 2,
            borderColor: theme.colors.primary,
            ...theme.shadows.large,
            minHeight: 350,
            justifyContent: 'space-between' as const,
            alignItems: 'center' as const,
            padding: theme.spacing.xl,
        },
    };

    return (
        <Pressable
            style={[
                cardStyles[variant],
            style
]}
    {...props}
>
    {children}
    </Pressable>
);
}