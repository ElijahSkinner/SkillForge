// components/GradientText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'expo-linear-gradient';

type GradientTextProps = TextProps & {
    colors?: string[];
};

export default function GradientText({ children, colors = ['#222222', '#fee37f'], style, ...props }: GradientTextProps) {
    return (
        <MaskedView maskElement={<Text style={[style, styles.mask]}>{children}</Text>}>
            <LinearGradient colors={colors} start={{ x: 0, y: 1 }} end={{ x: 0, y: 0 }}>
                <Text style={[style, { opacity: 0 }]} {...props}>
                    {children}
                </Text>
            </LinearGradient>
        </MaskedView>
    );
}

const styles = StyleSheet.create({
    mask: { backgroundColor: 'transparent' },
});
