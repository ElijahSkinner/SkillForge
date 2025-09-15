import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    Animated,
    ImageBackground,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/TopBar';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import { CERTS_ROADMAP } from '@/constants/certs';
import path from '@/assets/images/path.png';
import { ModuleType } from '@/types/certs';

import ViewShot, { captureRef } from 'react-native-view-shot';
import * as ImageManipulator from 'expo-image-manipulator';
import Color from 'color';

const { height: screenHeight } = Dimensions.get('window');
const TILE_SIZE = 60;
const TILE_SPACING = 8;

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);
    const viewShotRef = useRef(null);

    const [selectedLesson, setSelectedLesson] = useState<{
        modId: number;
        lessonIndex: number;
        lessonName: string;
    } | null>(null);

    const [dynamicColors, setDynamicColors] = useState<{ [key: number]: string }>({});

    if (!selectedCert)
        return <Text style={{ color: '#fff', padding: 20 }}>Select a cert first</Text>;

    const modules = CERTS_ROADMAP[selectedCert];
    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => ({
        id: idx + 1,
        name,
        score: 0,
    }));

    // Capture background color under a module label
    const sampleColor = async (modId: number, yPos: number) => {
        if (!viewShotRef.current) return;
        try {
            const uri = await captureRef(viewShotRef, {
                format: 'png',
                quality: 0.8,
                result: 'base64',
                width: 20,
                height: 20,
            });

            // Downscale + get pixel data
            const manipResult = await ImageManipulator.manipulateAsync(
                `data:image/png;base64,${uri}`,
                [{ resize: { width: 1, height: 1 } }],
                { base64: true }
            );

            if (manipResult.base64) {
                const base64Pixel = manipResult.base64;
                // First pixel is the "average color"
                const bgColor = `#${base64Pixel.substring(0, 6)}`;
                const lum = Color(bgColor).luminosity();
                const textColor = lum > 0.5 ? '#000' : '#fff';

                setDynamicColors((prev) => ({ ...prev, [modId]: textColor }));
            }
        } catch (e) {
            console.log('Color sample error', e);
        }
    };

    return (
        <ImageBackground
            source={path}
            style={{ flex: 1, width: 'auto' }}
            resizeMode="cover"
            imageStyle={{ resizeMode: 'cover', alignSelf: 'center' }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <TopBar
                        currentStreak={123}
                        currency={456}
                        selectedCourse={{ id: 0, name: selectedCert }}
                        enrolledCourses={enrolledCourses}
                    />

                    <ViewShot ref={viewShotRef} style={{ flex: 1 }}>
                        <Animated.ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={{
                                flexDirection: 'column-reverse',
                                alignItems: 'center',
                                paddingVertical: 30,
                            }}
                            onContentSizeChange={() => {
                                scrollViewRef.current?.scrollToEnd({ animated: false });
                            }}
                            scrollEventThrottle={16}
                            onScroll={Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: false }
                            )}
                        >
                            {modules.map((mod) => (
                                <View
                                    key={mod.id}
                                    style={{ marginBottom: 30, alignItems: 'center' }}
                                    onLayout={(e) => {
                                        const yPos = e.nativeEvent.layout.y;
                                        sampleColor(mod.id, yPos);
                                    }}
                                >
                                    {/* TOP: Q tile */}
                                    <Pressable
                                        style={{
                                            width: TILE_SIZE,
                                            height: TILE_SIZE,
                                            borderRadius: 12,
                                            marginBottom: TILE_SPACING,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#444',
                                        }}
                                        onPress={() =>
                                            setSelectedLesson({
                                                modId: mod.id,
                                                lessonIndex: 0,
                                                lessonName: `${mod.name} Unit Review`,
                                            })
                                        }
                                    >
                                        <Text style={styles.tileText}>Q</Text>
                                    </Pressable>

                                    {/* Lesson tiles */}
                                    {[...mod.lessons].reverse().map((lesson, index) => {
                                        const number = mod.lessons.length - index;
                                        return (
                                            <Pressable
                                                key={`${mod.id}-${number}`}
                                                style={{
                                                    width: TILE_SIZE,
                                                    height: TILE_SIZE,
                                                    marginBottom: TILE_SPACING,
                                                    borderRadius: 12,
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    backgroundColor: mod.completed ? '#27b0b9' : '#1a1b1f',
                                                }}
                                                onPress={() =>
                                                    setSelectedLesson({
                                                        modId: mod.id,
                                                        lessonIndex: number,
                                                        lessonName: lesson.name,
                                                    })
                                                }
                                            >
                                                <Text style={styles.tileText}>{number}</Text>
                                            </Pressable>
                                        );
                                    })}

                                    {/* BOTTOM: Chapter name with live-contrast color */}
                                    <Animated.Text
                                        style={[
                                            styles.sectionTitle,
                                            { color: dynamicColors[mod.id] || '#fee37f' },
                                        ]}
                                    >
                                        {mod.name}
                                    </Animated.Text>
                                </View>
                            ))}
                        </Animated.ScrollView>
                    </ViewShot>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 10,
        color: '#fee37f',
    },
    tileText: { color: '#fff', fontWeight: '600' },
});
