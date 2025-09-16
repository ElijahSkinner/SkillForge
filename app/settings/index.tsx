import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext'; // make sure path is correct

export default function SettingsScreen() {
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);

    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (!user) return;

        Alert.alert(
            'Confirm Logout',
            `Are you sure you want to log out, ${user.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Yes, Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                            router.replace('../home'); // navigate to home after logout
                        } catch (err) {
                            console.error('Logout failed:', err);
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

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

            {/* Logout Button */}
            <Pressable style={[styles.settingItem, { backgroundColor: '#ff3b30', justifyContent: 'center' }]} onPress={handleLogout}>
                <Text style={[styles.settingText, { color: '#fff', fontWeight: 'bold' }]}>Logout</Text>
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
