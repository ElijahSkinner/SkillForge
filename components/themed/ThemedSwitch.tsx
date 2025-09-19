// components/themed/ThemedSwitch.tsx
import React from 'react';
import { Switch, SwitchProps } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ThemedSwitchProps extends SwitchProps {}

export function ThemedSwitch({ ...props }: ThemedSwitchProps) {
    const { theme } = useTheme();

    return (
        <Switch
            thumbColor={props.value ? theme.colors.primary : theme.colors.textMuted}
            trackColor={{
                false: theme.colors.borderColor,
                true: `${theme.colors.primary}50` // 50% opacity
            }}
            {...props}
        />
    );
}