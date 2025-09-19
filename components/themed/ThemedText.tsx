// components/themed/ThemedText.tsx
import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ThemedTextProps extends TextProps {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body1' | 'body2' | 'caption' | 'button';
    color?: 'text' | 'textSecondary' | 'primary' | 'error' | 'success';
}

export function ThemedText({
                               variant = 'body1',
                               color = 'text',
                               style,
                               ...props
                           }: ThemedTextProps) {
    const { theme } = useTheme();

    const textStyle = theme.typography[variant] || theme.typography.body1;
    const textColor = theme.colors[color] || theme.colors.text;

    return (
        <Text
            style={[
                textStyle,
                { color: textColor },
                style
            ]}
            {...props}
        />
    );
}