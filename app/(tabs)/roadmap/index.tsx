import React, { useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Dimensions,
    Animated,
    ImageBackground, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '@/components/TopBar';
import QuizRoadmap from '@/components/QuizRoadmap';
import { useCert } from '@/context/CertContext';
import { useRouter } from 'expo-router';
import { CERTS_ROADMAP } from '@/constants/certs';
// @ts-ignore
import path from '@/assets/images/path.png';
import {ModuleType} from "@/types/certs";

const { height: screenHeight } = Dimensions.get('window');
const TILE_SIZE = 60;
const TILE_SPACING = 8;
const TILE_COUNT = 5;

export default function RoadmapScreen() {
    const { selectedCert } = useCert();
    const router = useRouter();
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<ScrollView | null>(null);
    const [modulePositions, setModulePositions] = React.useState<{ [key: number]: number }>({});
    const [selectedLesson, setSelectedLesson] = React.useState<{
        modId: number;
        lessonIndex: number;
        lessonName: string;
    } | null>(null);

    function getLessonXP(mod: ModuleType, lessonIndex: number) {
        const lessonCount = mod.lessons.length;
        const lessonWeight = mod.weight / lessonCount;
        return Math.round(lessonWeight);
    }


    if (!selectedCert)
        return <Text style={{ color: '#fff', padding: 20 }}>Select a cert first</Text>;

    const modules = CERTS_ROADMAP[selectedCert];
    const enrolledCourses = Object.keys(CERTS_ROADMAP).map((name, idx) => ({
        id: idx + 1,
        name,
        score: 0,
    }));

    // reversed numbers 5->1
    const numbers = Array.from({ length: TILE_COUNT }, (_, i) => TILE_COUNT - i);

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

                    <QuizRoadmap />

                    <Animated.ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={{
                            flexDirection: 'column-reverse',
                            alignItems: 'center',
                            paddingVertical: 30,
                        }}
                        onContentSizeChange={() => {
                            // auto-scroll to bottom once content is measured
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
                                        backgroundColor: '#444', // Q tile color
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

                                {/* Dynamic lesson tiles */}
                                {[...mod.lessons].reverse().map((lesson, index) => {
                                    const number = mod.lessons.length - index; // descending numbers
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
                                                router.push({
                                                    pathname: '/quiz/[cert]/[id]',
                                                    params: { cert: selectedCert, id: String(mod.id) },
                                                })
                                            }
                                        >
                                            <Text style={styles.tileText}>{number}</Text>
                                        </Pressable>
                                    );
                                })}


                                {/* BOTTOM: Chapter name */}
                                <Animated.Text style={[styles.sectionTitle]}>
                                    {mod.name}
                                </Animated.Text>
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
        color: '#fee37f', // fallback
    },
    tileText: { color: '#fff', fontWeight: '600' },
});
