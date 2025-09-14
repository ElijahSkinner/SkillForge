import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#1E90FF',
            }}
        >
            <Tabs.Screen
                name="home"  // internal key, can be anything unique
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                    name="glossary/index"
                    options={{
                        title: 'Glossary',
                        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
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
                        <Ionicons name="today-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="course/index"
                options={{
                    title: 'Courses',
                    tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="quiz/index"
                options={{
                    title: 'Quiz',
                    tabBarIcon: ({ color, size }) => <Ionicons name="help-circle" size={size} color={color} />,
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
                name="explore"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="quiz/[cert]/[id]"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
