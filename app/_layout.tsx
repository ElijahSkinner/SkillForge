// Update your app/_layout.tsx to add authentication protection

import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '../hooks/use-color-scheme';
import { CertProvider } from '@/context/CertContext';
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider as AppThemeProvider } from "@/context/ThemeContext";
import { backgroundStreakService } from '@/services/BackgroundStreakService';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

export const unstable_settings = {
    anchor: '(tabs)',
};

// Protected content wrapper
function ProtectedContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0d0e12' }}>
                <ActivityIndicator size="large" color="#ffa500" />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/home" />;
    }

    return <>{children}</>;
}

export default function RootLayout() {
    const colorScheme = useColorScheme();

    // Clean up streak service when app closes
    useEffect(() => {
        return () => {
            backgroundStreakService.cleanup();
        };
    }, []);

    return (
        <AuthProvider>
            <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <AppThemeProvider>
                    <CertProvider>
                        <Stack>
                            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                            <Stack.Screen
                                name="(tabs)"
                                options={{ headerShown: false }}
                                listeners={{
                                    beforeRemove: (e) => {
                                        // This will protect the tabs from being accessed without auth
                                    }
                                }}
                            />
                            <Stack.Screen
                                name="quiz"
                                options={{ headerShown: false, presentation: 'modal' }}
                            />
                            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                        </Stack>
                        <StatusBar style="auto" />
                    </CertProvider>
                </AppThemeProvider>
            </NavigationThemeProvider>
        </AuthProvider>
    );
}