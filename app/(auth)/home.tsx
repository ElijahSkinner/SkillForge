// app/(auth)/home.tsx - FIXED VERSION
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    TextInput,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { Stack } from 'expo-router';

const { width } = Dimensions.get('window');

type AuthMode = 'splash' | 'login' | 'register' | 'forgot';

export default function RootHomeScreen() {
    const router = useRouter();
    const { login, register, forgotPassword } = useAuth();
    const { theme } = useTheme();

    const [authMode, setAuthMode] = useState<AuthMode>('splash');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Check first launch (keeping your existing logic)
    useEffect(() => {
        const checkFirstLaunch = async () => {
            const value = await AsyncStorage.getItem('alreadyLaunched');
            if (value === null) {
                await AsyncStorage.setItem('alreadyLaunched', 'true');
            }
        };
        checkFirstLaunch();
    }, []);

    const clearMessages = () => {
        setError("");
        setSuccessMessage("");
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        clearMessages();
        setLoading(true);
        try {
            await login(email, password);
            router.replace('/(tabs)/roadmap');
        } catch (err: any) {
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }

        clearMessages();
        setLoading(true);
        try {
            await register(email, password, name);
            setSuccessMessage("Account created! Please check your email to verify your account.");
            setTimeout(() => {
                router.replace('/(tabs)/roadmap');
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        clearMessages();
        setLoading(true);
        try {
            await forgotPassword(email);
            setSuccessMessage("Password reset email sent! Check your inbox.");
            setTimeout(() => {
                setAuthMode('login');
            }, 2000);
        } catch (err: any) {
            setError(err.message || "Failed to send reset email. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        clearMessages();
    };

    const switchMode = (mode: AuthMode) => {
        setAuthMode(mode);
        resetForm();
    };

    // Create styles using the current theme
    const styles = {
        container: {
            flex: 1,
        } as ViewStyle,
        scrollContainer: {
            flexGrow: 1,
            justifyContent: 'center' as const,
            padding: theme.spacing.lg,
        } as ViewStyle,
        contentContainer: {
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
        } as ViewStyle,
        formContainer: {
            width: '100%',
            maxWidth: 400,
            alignSelf: 'center' as const,
        } as ViewStyle,
        logo: {
            width: width * 0.6,
            height: width * 0.6,
            marginBottom: theme.spacing.xl,
        } as ImageStyle,
        title: {
            ...theme.typography.h1,
            textAlign: 'center' as const,
            marginBottom: theme.spacing.sm,
        } as TextStyle,
        subtitle: {
            ...theme.typography.body1,
            color: theme.colors.textSecondary,
            textAlign: 'center' as const,
            marginBottom: theme.spacing.xl,
        } as TextStyle,
        formTitle: {
            ...theme.typography.h2,
            textAlign: 'center' as const,
            marginBottom: theme.spacing.sm,
        } as TextStyle,
        formSubtitle: {
            ...theme.typography.body2,
            color: theme.colors.textSecondary,
            textAlign: 'center' as const,
            marginBottom: theme.spacing.lg,
        } as TextStyle,
        buttonContainer: {
            width: "100%",
            gap: theme.spacing.md,
        } as ViewStyle,
        button: {
            paddingVertical: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            alignItems: 'center' as const,
        } as ViewStyle,
        submitButton: {
            paddingVertical: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            alignItems: 'center' as const,
            marginTop: theme.spacing.sm,
            marginBottom: theme.spacing.md,
        } as ViewStyle,
        buttonText: {
            ...theme.typography.button,
        } as TextStyle,
        input: {
            flex: 1,
            padding: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.borderColor,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.md,
            fontSize: 16,
        } as TextStyle,
        link: {
            ...theme.typography.body1,
            color: theme.colors.primary,
            textAlign: "center" as const,
            marginVertical: theme.spacing.xs,
        } as TextStyle,
        forgotButton: {
            alignSelf: 'flex-end' as const,
            marginBottom: theme.spacing.sm,
        } as ViewStyle,
        switchModeContainer: {
            flexDirection: 'row' as const,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            marginTop: theme.spacing.md,
        } as ViewStyle,
        switchModeText: {
            ...theme.typography.body1,
            color: theme.colors.textSecondary,
        } as TextStyle,
        messageContainer: {
            padding: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.md,
        } as ViewStyle,
        messageText: {
            ...theme.typography.body2,
            color: '#fff',
            textAlign: 'center' as const,
            fontWeight: '500' as const,
        } as TextStyle,
    };

    const renderSplashScreen = () => (
        <View style={styles.contentContainer}>
            <Image
                source={require('../../assets/images/new-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.title}>
                Welcome to SkillForge!
            </Text>
            <Text style={styles.subtitle}>
                Learn, practice, and master your tech certifications
            </Text>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary }]}
                    onPress={() => switchMode('login')}
                >
                    <Text style={[styles.buttonText, { color: theme.colors.textOnPrimary }]}>
                        Login
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.secondary }]}
                    onPress={() => switchMode('register')}
                >
                    <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                        Sign Up
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.borderColor }]}
                    onPress={() => alert("Google login coming soon")}
                >
                    <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                        Continue with Google
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.borderColor }]}
                    onPress={() => alert("GitHub login coming soon")}
                >
                    <Text style={[styles.buttonText, { color: theme.colors.text }]}>
                        Continue with GitHub
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderLoginForm = () => (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
                Welcome Back
            </Text>
            <Text style={styles.formSubtitle}>
                Sign in to continue your learning journey
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                onPress={() => switchMode('forgot')}
                style={styles.forgotButton}
            >
                <Text style={styles.link}>
                    Forgot Password?
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.textOnPrimary} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.colors.textOnPrimary }]}>
                        Sign In
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => switchMode('splash')}>
                <Text style={styles.link}>
                    ← Back to login options
                </Text>
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
                <Text style={styles.switchModeText}>
                    Dont have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => switchMode('register')}>
                    <Text style={styles.link}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderRegisterForm = () => (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
                Create Account
            </Text>
            <Text style={styles.formSubtitle}>
                Join SkillForge and start your certification journey
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.textOnPrimary} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.colors.textOnPrimary }]}>
                        Create Account
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => switchMode('splash')}>
                <Text style={styles.link}>
                    ← Back to login options
                </Text>
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
                <Text style={styles.switchModeText}>
                    Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => switchMode('login')}>
                    <Text style={styles.link}>
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderForgotPasswordForm = () => (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
                Reset Password
            </Text>
            <Text style={styles.formSubtitle}>
                Enter your email to receive a password reset link
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleForgotPassword}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.textOnPrimary} />
                ) : (
                    <Text style={[styles.buttonText, { color: theme.colors.textOnPrimary }]}>
                        Send Reset Email
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => switchMode('login')}>
                <Text style={styles.link}>
                    ← Back to Sign In
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />

            <LinearGradient
                colors={[theme.colors.background, theme.colors.primary, theme.colors.accent]}
                style={styles.container}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Messages */}
                        {error ? (
                            <View style={[styles.messageContainer, { backgroundColor: theme.colors.error }]}>
                                <Text style={styles.messageText}>{error}</Text>
                            </View>
                        ) : null}

                        {successMessage ? (
                            <View style={[styles.messageContainer, { backgroundColor: theme.colors.success }]}>
                                <Text style={styles.messageText}>{successMessage}</Text>
                            </View>
                        ) : null}

                        {/* Render appropriate form based on authMode */}
                        {authMode === 'splash' && renderSplashScreen()}
                        {authMode === 'login' && renderLoginForm()}
                        {authMode === 'register' && renderRegisterForm()}
                        {authMode === 'forgot' && renderForgotPasswordForm()}
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </>
    );
}