import { View, Text, StyleSheet, Pressable, ScrollView, Switch } from 'react-native';
import { useState } from 'react';

export default function SettingsScreen() {
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.title}>Settings</Text>

            {/* Dark Mode Toggle */}
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch
                    value={darkMode}
                    onValueChange={(val) => setDarkMode(val)}
                    thumbColor={darkMode ? '#27b0b9' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#4a90e2' }}
                />
            </View>

            {/* Notifications Toggle */}
            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Notifications</Text>
                <Switch
                    value={notifications}
                    onValueChange={(val) => setNotifications(val)}
                    thumbColor={notifications ? '#27b0b9' : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: '#4a90e2' }}
                />
            </View>

            {/* Placeholder for more settings */}
            <Pressable style={styles.settingItem} onPress={() => alert('Account Settings coming soon')}>
                <Text style={styles.settingText}>Account</Text>
            </Pressable>

            <Pressable style={styles.settingItem} onPress={() => alert('Privacy Settings coming soon')}>
                <Text style={styles.settingText}>Privacy</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    title: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e1e1e',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    settingText: { color: '#fff', fontSize: 16, fontWeight: '500' },
});
