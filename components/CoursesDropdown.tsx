// skillforge/components/CoursesDropdown.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

type Course = {
    id: number;
    name: string;
    score: number; // Current score in course
};

type CoursesDropdownProps = {
    onClose: () => void;
    enrolledCourses?: Course[];
};

export default function CoursesDropdown({ onClose, enrolledCourses = [] }: CoursesDropdownProps) {
    return (
        <Pressable style={styles.overlay} onPress={onClose}>
            <Pressable style={styles.dropdown} onPress={() => {}}>
                <Text style={styles.title}>Your Courses</Text>
                <ScrollView style={{ maxHeight: 250 }}>
                    {enrolledCourses.map((course) => (
                        <View key={course.id} style={styles.courseRow}>
                            <Text style={styles.courseName}>{course.name}</Text>
                            <Text style={styles.courseScore}>{course.score}%</Text>
                        </View>
                    ))}
                    {/* Add new course button */}
                    <Pressable
                        style={styles.addCourse}
                        onPress={() => {
                            onClose();           // close dropdown
                            router.push('/course'); // navigate to courses page
                        }}
                    >
                        <Text style={styles.addText}>+ Add Course</Text>
                    </Pressable>
                </ScrollView>
            </Pressable>
        </Pressable>

    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 60, // adjust based on TopBar height
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
    },
    dropdown: {
        backgroundColor: '#1a1b1f',
        borderRadius: 12,
        padding: 16,
    },
    title: { color: '#fff', fontWeight: '700', fontSize: 16, marginBottom: 12 },
    courseRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
    courseName: { color: '#fff', fontSize: 14 },
    courseScore: { color: '#27b0b9', fontWeight: '600' },
    addCourse: { marginTop: 12, alignItems: 'center', paddingVertical: 8, borderRadius: 8, backgroundColor: '#333' },
    addText: { color: '#fff', fontWeight: '600' },
});
