// components/themed/ThemedBadge.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ThemedText } from './ThemedText';

interface ThemedBadgeProps extends ViewProps {
    text: string;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'inverted';
    size?: 'small' | 'medium' | 'large';
}

export function ThemedBadge({
                                text,
                                variant = 'primary',
                                size = 'medium',
                                style,
                                ...props
                            }: ThemedBadgeProps) {
    const { theme } = useTheme();

    const badgeStyles = {
        primary: {
            backgroundColor: theme.colors.primary,
            textColor: theme.colors.textOnPrimary,
        },
        secondary: {
            backgroundColor: theme.colors.secondary,
            textColor: theme.colors.text,
        },
        success: {
            backgroundColor: theme.colors.success,
            textColor: theme.colors.textOnPrimary,
        },
        warning: {
            backgroundColor: theme.colors.warning,
            textColor: theme.colors.textOnPrimary,
        },
        error: {
            backgroundColor: theme.colors.error,
            textColor: theme.colors.textOnPrimary,
        },
        inverted: {
            backgroundColor: theme.colors.textOnPrimary,
            textColor: theme.colors.primary,
        },
    };

    const sizeStyles = {
        small: {
            paddingHorizontal: theme.spacing.xs,
            paddingVertical: theme.spacing.xs / 2,
            fontSize: theme.typography.overline.fontSize - 1,
        },
        medium: {
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: theme.spacing.xs,
            fontSize: theme.typography.overline.fontSize,
        },
        large: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            fontSize: theme.typography.caption.fontSize,
        },
    };

    const currentStyle = badgeStyles[variant];
    const currentSize = sizeStyles[size];

    return (
        <View
            style={[
                {
                    backgroundColor: currentStyle.backgroundColor,
                    borderRadius: theme.borderRadius.round,
                    paddingHorizontal: currentSize.paddingHorizontal,
                    paddingVertical: currentSize.paddingVertical,
                    alignSelf: 'flex-start' as const,
                },
            style
]}
    {...props}
>
    <ThemedText
        style={{
        color: currentStyle.textColor,
            fontSize: currentSize.fontSize,
            fontWeight: '800' as const,
            letterSpacing: 0.8,
            textTransform: 'uppercase' as const,
    }}
>
    {text}
    </ThemedText>
    </View>
);
}