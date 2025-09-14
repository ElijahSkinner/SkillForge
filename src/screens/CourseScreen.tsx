import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CourseScreen = () => (
    <View style={styles.container}>
        <Text>Course Screen</Text>
    </View>
);

export default CourseScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
