import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CertProvider } from '@/context/CertContext';
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider as AppThemeProvider } from "@/context/ThemeContext";
import { backgroundStreakService } from '@/services/BackgroundStreakService';

export const unstable_settings = {
    anchor: '(tabs)',
};

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
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                        </Stack>
                        <StatusBar style="auto" />
                    </CertProvider>
                </AppThemeProvider>
            </NavigationThemeProvider>
        </AuthProvider>
    );
}