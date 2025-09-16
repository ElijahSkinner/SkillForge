import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Switch, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // Trigger logout modal
    const handleLogout = () => setModalVisible(true);

    // Confirm logout
    const confirmLogout = async () => {
        try {
            await logout();
            setModalVisible(false);
            router.replace('../home');
        } catch (err) {
            console.error('Logout failed:', err);
        }
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

            {/* Placeholder Settings */}
            <Pressable style={styles.settingItem} onPress={() => alert('Account Settings coming soon')}>
                <Text style={styles.settingText}>Account</Text>
            </Pressable>

            <Pressable style={styles.settingItem} onPress={() => alert('Privacy Settings coming soon')}>
                <Text style={styles.settingText}>Privacy</Text>
            </Pressable>

            {/* Logout Button */}
            <Pressable style={[styles.settingItem, { justifyContent: 'center' }]} onPress={handleLogout}>
                <Text style={[styles.settingText, { color: '#ff4d4d' }]}>Logout</Text>
            </Pressable>

            {/* Logout Confirmation Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>
                            Are you sure you want to logout, {user?.name || 'User'}?
                        </Text>
                        <View style={styles.modalButtons}>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text>Cancel</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.modalButton, { backgroundColor: '#ff4d4d' }]}
                                onPress={confirmLogout}
                            >
                                <Text style={{ color: '#fff' }}>Logout</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
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

    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '80%',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
});
