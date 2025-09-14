// skillforge/components/CoursesDropdown.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

type Course = {
    id: number;
    name: string;
    score: number;
};

type CoursesDropdownProps = {
    onClose: () => void;
    enrolledCourses?: Course[];
};

const { height } = Dimensions.get('window');

export default function CoursesDropdown({ onClose, enrolledCourses = [] }: CoursesDropdownProps) {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Transparent background */}
            <Pressable style={styles.overlay} onPress={onClose} />

            {/* Dropdown content */}
            <View style={styles.dropdown}>
                <Text style={styles.title}>Your Courses</Text>
                <ScrollView style={{ maxHeight: 250 }} contentContainerStyle={{ paddingBottom: 10 }}>
                    {enrolledCourses.map((course) => (
                        <View key={course.id} style={styles.courseRow}>
                            <Text style={styles.courseName}>{course.name}</Text>
                            <Text style={styles.courseScore}>{course.score}%</Text>
                        </View>
                    ))}

                    {/* Add new course */}
                    <Pressable
                        style={styles.addCourse}
                        onPress={() => {
                            router.push('/course'); // Navigate to the full course list
                            onClose(); // Close the dropdown
                        }}
                    >
                        <Text style={styles.addText}>+ Add Course</Text>
                    </Pressable>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 60, // adjust based on TopBar height
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    dropdown: {
        backgroundColor: '#1a1b1f',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        zIndex: 10,
    },
    title: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 12,
    },
    courseRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    courseName: { color: '#fff', fontSize: 14 },
    courseScore: { color: '#27b0b9', fontWeight: '600' },
    addCourse: {
        marginTop: 12,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#333',
    },
    addText: { color: '#fff', fontWeight: '600' },
});
