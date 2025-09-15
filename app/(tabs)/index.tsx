import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={require('@/assets/images/new-logo.png')}
                    style={styles.headerImage}
                />
            }
        >
            {/* Welcome Section */}
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome to SkillForge!</ThemedText>
                <HelloWave />
            </ThemedView>

            {/* Quick Start Steps */}
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 1: Choose a Course</ThemedText>
                <ThemedText>
                    Tap a course below to start learning. You can start with{' '}
                    <ThemedText type="defaultSemiBold">A+</ThemedText>, then move on to{' '}
                    <ThemedText type="defaultSemiBold">Security+</ThemedText> or{' '}
                    <ThemedText type="defaultSemiBold">Network+</ThemedText>.
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 2: Track Your Progress</ThemedText>
                <ThemedText>
                    Your XP, streaks, and badges are saved automatically. Come back daily to level up your
                    skills!
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 3: Take Quizzes</ThemedText>
                <ThemedText>
                    Each module has interactive quizzes. Tap the{' '}
                    <ThemedText type="defaultSemiBold">Quiz</ThemedText> tab to test your knowledge and earn XP.
                </ThemedText>
            </ThemedView>

            {/* Optional Explore / More Info Link */}
            <ThemedView style={styles.stepContainer}>
                <Link href="/modal">
                    <Link.Trigger>
                        <ThemedText type="subtitle">Learn More</ThemedText>
                    </Link.Trigger>
                    <Link.Preview />
                </Link>
                <ThemedText>
                    Tap the Explore tab to browse additional resources and tips for your tech certifications.
                </ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    stepContainer: {
        gap: 6,
        marginBottom: 12,
    },
    headerImage: {
        height: 160,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});
