import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';


export default function TabLayout() {
    const { user, loading } = useAuth();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0e12' }}>
                <ActivityIndicator size="large" color="#ffa500" />
            </View>
        );
    }

    // Redirect to auth if not logged in
    if (!user) {
        return <Redirect href="/(auth)/home" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1E90FF',
            }}
        >
            <Tabs.Screen
                name="roadmap/index"  // internal key, can be anything unique
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="footsteps-sharp" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                    name="glossary/index"
                    options={{
                        title: 'Glossary',
                        tabBarIcon: ({ color, size }) => <Ionicons name="create" size={size} color={color} />,
                    }}
            />
            <Tabs.Screen
                name="today/index"
                options={{
                    title: "Today",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="today-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="league/index"
                options={{
                    title: "League",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="trophy-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="course/index"
                options={{
                    href: null,
                    title: 'Courses',
                    tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="glossary/Flashcards"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
