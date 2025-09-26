// components/themed/ThemedProgressBar.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface ThemedProgressBarProps extends ViewProps {
    progress: number; // 0-100
    variant?: 'default' | 'thin' | 'thick';
    color?: 'primary' | 'success' | 'warning' | 'error';
    showGlow?: boolean;
}

export function ThemedProgressBar({
                                      progress,
                                      variant = 'default',
                                      color = 'primary',
                                      showGlow = false,
                                      style,
                                      ...props
                                  }: ThemedProgressBarProps) {
    const { theme } = useTheme();

    const heights = {
        thin: 2,
        default: 4,
        thick: 8,
    };

    const colors = {
        primary: theme.colors.primary,
        success: theme.colors.success,
        warning: theme.colors.warning,
        error: theme.colors.error,
    };

    const height = heights[variant];
    const progressColor = colors[color];
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <View
            style={[
                {
                    height,
                    backgroundColor: theme.colors.surfaceVariant,
                    borderRadius: height / 2,
                    overflow: 'hidden' as const,
                },
            style
]}
    {...props}
>
    <View
        style={{
        height: '100%',
            width: `${clampedProgress}%`,
            backgroundColor: progressColor,
            borderRadius: height / 2,
            minWidth: clampedProgress > 0 ? height : 0, // Ensure visibility
    ...(showGlow && {
            shadowColor: progressColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 4,
            elevation: 4,
        }),
    }}
    />
    </View>
);
}