// components/GradientText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

type GradientTextProps = TextProps & {
    colors?: string[]; // normal string array
};

export default function GradientText({
                                         children,
                                         colors = ['#222222', ],
                                         style,
                                         ...props
                                     }: GradientTextProps) {
    // Ensure LinearGradient gets a proper tuple type
    const gradientColors = colors as unknown as readonly [string, string, ...string[]];

    return (
        <MaskedView
            maskElement={<Text style={[style, styles.mask]}>{children}</Text>}
        >
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
            >
                {/* Invisible text for masking */}
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
