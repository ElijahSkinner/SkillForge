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

const { height: screenHeight } = Dimensions.get('window');
const TILE_SIZE = 60;
const TILE_SPACING = 8;

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);

    const [selectedLesson, setSelectedLesson] = useState<{
        modId: number;
        lessonIndex: number;
        lessonName: string;
    } | null>(null);

    if (!selectedCert)
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Please select a certification first.</Text>
                <Pressable
                    style={styles.button}
                    onPress={() => router.push('../course')}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Select a Cert</Text>
                </Pressable>
            </View>
        );

    const modules = CERTS_ROADMAP[selectedCert];
    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => ({
        id: idx + 1,
        name,
        score: 0,
    }));

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
                            <View key={mod.id} style={{ marginBottom: 30, alignItems: 'center' }}>
                                {/* TOP: Q tile */}
                                <Pressable
                                    style={{
                                        width: TILE_SIZE,
                                        height: TILE_SIZE,
                                        borderRadius: 12,
                                        marginBottom: TILE_SPACING,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: '#222',
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
                                                backgroundColor: mod.completed ? '#55555' : '#55555',
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

                                {/* Chapter name */}
                                <Text style={styles.sectionTitle}>{mod.name}</Text>
                            </View>
                        ))}
                    </Animated.ScrollView>
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
    container: {
        flex: 1,
        backgroundColor: '#121212',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    message: {
        color: '#aaa',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#27b0b9',
        borderRadius: 8,
    },
});
