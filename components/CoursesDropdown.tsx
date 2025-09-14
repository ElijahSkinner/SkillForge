import { View, Text, ScrollView, StyleSheet, Pressable, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';

type Course = { id: number; name: string; score: number };

type CoursesDropdownProps = {
    onClose: () => void;
    enrolledCourses?: Course[];
};

export default function CoursesDropdown({ onClose, enrolledCourses = [] }: CoursesDropdownProps) {
    const router = useRouter();

    return (
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay}>
                <View style={styles.dropdown}>
                    <Text style={styles.title}>Your Courses</Text>
                    <ScrollView style={{ maxHeight: 250 }}>
                        {enrolledCourses.map((course) => (
                            <View key={course.id} style={styles.courseRow}>
                                <Text style={styles.courseName}>{course.name}</Text>
                                <Text style={styles.courseScore}>{course.score}%</Text>
                            </View>
                        ))}

                        <Pressable
                            style={styles.addCourse}
                            onPress={() => {
                                router.push('/tabs/course');
                                onClose();
                            }}
                        >
                            <Text style={styles.addText}>+ Add Course</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 60,
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
