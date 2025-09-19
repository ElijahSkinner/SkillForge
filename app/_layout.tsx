import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CertProvider } from '@/context/CertContext'; //
import { AuthProvider } from "@/context/AuthContext";
//import { ThemeProvider } from "@/context/ThemeContext";


export const unstable_settings = {
    anchor: '(tabs)',
};
export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <CertProvider>
                <AuthProvider>
                    <Stack>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
                    </Stack>
                </AuthProvider> </CertProvider>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
