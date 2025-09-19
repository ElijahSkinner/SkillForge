// components/AnimatedProgressTile.tsx
import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, View, PressableProps, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimatedProgressTileProps extends Omit<PressableProps, 'style'> {
    size: number;
    progress: number; // 0 to 1
    backgroundColor?: string;
    progressColor?: string;
    strokeWidth?: number;
    children?: React.ReactNode;
    style?: ViewStyle;
}

export default function AnimatedProgressTile({
                                                 size,
                                                 progress,
                                                 backgroundColor = '#1a1b1f',
                                                 progressColor = '#27b0b9',
                                                 strokeWidth = 4,
                                                 children,
                                                 style,
                                                 ...pressableProps
                                             }: AnimatedProgressTileProps) {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: progress,
            duration: 1000,
            useNativeDriver: false,
        }).start();
    }, [progress]);

    // Calculate stroke dash offset for progress
    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <Pressable
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                },
                style,
            ]}
            {...pressableProps}
        >
            {/* Progress Ring */}
            <View style={{ position: 'absolute', top: 0, left: 0 }}>
                <Svg width={size} height={size}>
                    {/* Background Circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </Svg>
            </View>

            {/* Content */}
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1
            }}>
                {children}
            </View>
        </Pressable>
    );
}