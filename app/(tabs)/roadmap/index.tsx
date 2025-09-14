import React, {useEffect, useRef} from 'react';
import { Animated, View, ScrollView, StyleSheet, Text, Pressable, ImageBackground } from 'react-native';
import TopBar from '@/components/TopBar';
import { CERTS_ROADMAP } from '@/constants/certs';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import MaskedView from '@react-native-masked-view/masked-view';

import QuizRoadmap from '@/components/QuizRoadmap';
import GradientText from '@/components/GradientText';
import { LinearGradient } from 'expo-linear-gradient';


import { SafeAreaView } from 'react-native-safe-area-context';
// @ts-ignore
import path from '@/assets/images/path.png';

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const TILE_SIZE = 60;      // width & height of each tile
    const TILE_SPACING = 8;    // spacing between tiles
    const TILE_COUNT = 5;
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);
    const numbers = Array.from({ length: TILE_COUNT }, (_, i) => TILE_COUNT - i); // [5,4,3,2,1]
    useEffect(() => {
        const timeout = setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
        }, 0); // small delay lets layout finish

        return () => clearTimeout(timeout);
    }, []);
    if (!selectedCert)
        return <Text style={{ color: '#fff', padding: 20 }}>Select a cert first</Text>;

    const modules = CERTS_ROADMAP[selectedCert];

    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => ({
        id: idx + 1,
        name,
        score: 0,
    }));

    return (
        <ImageBackground
            source={path}
            style={{ flex: 1, width: 'auto'}}
            resizeMode="cover"
            imageStyle={{ resizeMode: 'cover', alignSelf: 'center'}}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {/* TopBar with enrolled courses */}
                    <TopBar
                        currentStreak={123}
                        currency={456}
                        selectedCourse={{ id: 0, name: selectedCert }}
                        enrolledCourses={enrolledCourses}
                    />

                    {/* Optional Quiz Roadmap overview */}


                    {/* ScrollView with bottom-to-top scroll */}
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
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false } // color animation can't use native driver
                        )}
                        scrollEventThrottle={16} // ensures smooth updates
                    >
                        {modules.map((mod) => {
                            // Map scroll position to a color for this module name
                            const moduleColor = scrollY.interpolate({
                                inputRange: [0, 300], // adjust this based on your layout
                                outputRange: ['#222222', '#fee37f'],
                                extrapolate: 'clamp',
                            });

                            return (
                                <View key={mod.id} style={{ marginBottom: 30, alignItems: 'center' }}>
                                    {/* Quiz tile */}
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
                                            router.push({
                                                pathname: '/quiz/[cert]/[id]',
                                                params: { cert: selectedCert, id: `${mod.id}-quiz` },
                                            })
                                        }
                                    >
                                        <Text style={styles.tileText}>Q</Text>
                                    </Pressable>

                                    {/* Numbered tiles */}
                                    {numbers.map((number) => (
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
                                                router.push({
                                                    pathname: '/quiz/[cert]/[id]',
                                                    params: { cert: selectedCert, id: String(mod.id) },
                                                })
                                            }
                                        >
                                            <Text style={styles.tileText}>{number}</Text>
                                        </Pressable>
                                    ))}

                                    {/* Animated chapter name */}
                                    <Animated.Text style={[styles.sectionTitle, { color: moduleColor }]}>
                                        {mod.name}
                                    </Animated.Text>
                                </View>
                            );
                        })}
                    </Animated.ScrollView>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 30 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'gold', marginBottom: 10 },
    tilesColumn: { flexDirection: 'column', marginBottom: 12 },
    tile: {
        width: 60,
        height: 60,
        backgroundColor: '#1a1b1f',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    completedTile: { backgroundColor: '#27b0b9' },
    tileText: { color: '#fff', fontWeight: '600' },
    quizTile: {
        height: 50,
        backgroundColor: '#444',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quizText: { color: '#fff', fontWeight: '700' },
});
