// components/themed/ThemedView.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ThemedViewProps extends ViewProps {
    variant?: 'background' | 'surface' | 'card';
}

export function ThemedView({ variant = 'background', style, ...props }: ThemedViewProps) {
    const { theme } = useTheme();

    const backgroundColor = {
        background: theme.colors.background,
        surface: theme.colors.surface,
        card: theme.colors.cardBackground,
    }[variant];

    return <View style={[{ backgroundColor }, style]} {...props} />;
}
