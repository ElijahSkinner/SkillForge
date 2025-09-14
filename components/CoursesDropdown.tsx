// skillforge/components/CoursesDropdown.tsx
import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Modal,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { useRouter } from 'expo-router';

// Individual course option
export const MenuOption = ({ onSelect, children }: { onSelect: () => void; children: React.ReactNode }) => {
    return (
        <Pressable onPress={onSelect} style={styles.menuOption}>
            {children}
        </Pressable>
    );
};

type Course = {
    id: number;
    name: string;
    score: number;
};

type CoursesDropdownProps = {
    trigger: React.ReactNode; // What opens the dropdown
    enrolledCourses?: Course[];
};

export default function CoursesDropdown({ trigger, enrolledCourses = [] }: CoursesDropdownProps) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const triggerRef = useRef<View>(null);
    const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });

    // Measure trigger position to place dropdown
    useEffect(() => {
        if (triggerRef.current && visible) {
            triggerRef.current.measure((fx, fy, width, height, px, py) => {
                setPosition({ x: px, y: py + height, width });
            });
        }
    }, [visible]);

    return (
        <View>
            {/* Trigger element */}
            <Pressable ref={triggerRef} onPress={() => setVisible(true)}>
                {trigger}
            </Pressable>

            {/* Modal dropdown */}
            <Modal
                transparent
                visible={visible}
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View
                            style={[
                                styles.dropdown,
                                { top: position.y, left: position.x + position.width / 2 - 150 / 2, width: 150 },
                            ]}
                        >
                            <Text style={styles.title}>Your Courses</Text>
                            <ScrollView style={{ maxHeight: 250 }}>
                                {enrolledCourses.map((course) => (
                                    <MenuOption key={course.id} onSelect={() => console.log(course.name)}>
                                        <Text style={styles.courseName}>{course.name}</Text>
                                        <Text style={styles.courseScore}>{course.score}%</Text>
                                    </MenuOption>
                                ))}

                                <MenuOption
                                    onSelect={() => {
                                        router.push('/course'); // Go to course page
                                        setVisible(true);
                                    }}
                                >
                                    <Text style={styles.addText}>+ Add Course</Text>
                                </MenuOption>
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: '#1a1b1f',
        borderRadius: 12,
        padding: 12,
        elevation: 5,
    },
    title: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
    },
    menuOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 6,
    },
    courseName: { color: '#fff', fontSize: 14 },
    courseScore: { color: '#27b0b9', fontWeight: '600' },
    addText: { color: '#fff', fontWeight: '600', textAlign: 'center' },
});
