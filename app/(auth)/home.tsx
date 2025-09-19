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
    Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

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
            // Optionally redirect to roadmap or keep them on verification screen
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

    const renderSplashScreen = () => (
        <View style={styles.contentContainer}>
            <Image
                source={require('@/assets/images/new-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={[styles.title, { color: theme.colors.text }]}>
                Welcome to SkillForge!
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
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
            <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                Welcome Back
            </Text>
            <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
                Sign in to continue your learning journey
            </Text>

            <TextInput
                style={[styles.input, {
                    borderColor: theme.colors.borderColor,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                }]}
                placeholder="Email"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={[styles.input, {
                    borderColor: theme.colors.borderColor,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                }]}
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
                <Text style={[styles.link, { color: theme.colors.primary }]}>
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
                <Text style={[styles.link, { color: theme.colors.primary }]}>
                    ← Back to login options
                </Text>
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
                <Text style={[styles.switchModeText, { color: theme.colors.textSecondary }]}>
                    Don't have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => switchMode('register')}>
                    <Text style={[styles.link, { color: theme.colors.primary }]}>
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderRegisterForm = () => (
        <View style={styles.formContainer}>
            <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                Create Account
            </Text>
            <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
                Join SkillForge and start your certification journey
            </Text>

            <TextInput
                style={[styles.input, {
                    borderColor: theme.colors.borderColor,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                }]}
                placeholder="Full Name"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={[styles.input, {
                    borderColor: theme.colors.borderColor,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                }]}
                placeholder="Email"
                placeholderTextColor={theme.colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />

            <TextInput
                style={[styles.input, {
                    borderColor: theme.colors.borderColor,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                }]}
                placeholder="Password"
                placeholderTextColor={theme.colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TextInput
                style={[styles.input, {
                    borderColor: theme.colors.borderColor,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                }]}
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
                <Text style={[styles.link, { color: theme.colors.primary }]}>
                    ← Back to login options
                </Text>
            </TouchableOpacity>

            <View style={styles.switchModeContainer}>
                <Text style={[styles.switchModeText, { color: theme.colors.textSecondary }]}>
                    Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => switchMode('login')}>
                    <Text style={[styles.link, { color: theme.colors.primary }]}>
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderForgotPasswordForm = () => (
        <View style={styles.formContainer}>
            <Text style={[styles.formTitle, { color: theme.colors.text }]}>
                Reset Password
            </Text>
            <Text style={[styles.formSubtitle, { color: theme.colors.textSecondary }]}>
                Enter your email to receive a password reset link
            </Text>

            <TextInput
                style={[styles.input, {
                    borderColor: theme.colors.borderColor,
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text
                }]}
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
                <Text style={[styles.link, { color: theme.colors.primary }]}>
                    ← Back to Sign In
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
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
    );
}

const styles = {
    container: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    contentContainer: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center' as const,
    },
    logo: {
        width: width * 0.6,
        height: width * 0.6,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold' as const,
        textAlign: 'center' as const,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center' as const,
        marginBottom: 40,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        textAlign: 'center' as const,
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 14,
        textAlign: 'center' as const,
        marginBottom: 24,
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    button: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center' as const,
    },
    submitButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center' as const,
        marginTop: 8,
        marginBottom: 16,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold' as const,
    },
    input: {
        width: "100%",
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    link: {
        fontSize: 16,
        textAlign: "center" as const,
        marginVertical: 4,
    },
    forgotButton: {
        alignSelf: 'flex-end' as const,
        marginBottom: 8,
    },
    switchModeContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        marginTop: 16,
    },
    switchModeText: {
        fontSize: 16,
    },
    messageContainer: {
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    messageText: {
        color: '#fff',
        textAlign: 'center' as const,
        fontSize: 14,
        fontWeight: '500' as const,
    },
};