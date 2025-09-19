import React, { createContext, useContext, useState, useEffect } from "react";
import { Account, Client, Databases, ID, Query } from "appwrite";

const client = new Client()
    .setEndpoint("http://192.168.40.142/v1") // TODO: Move to environment variables
    .setProject("68c99e72002c3fb21bdf");

const databases = new Databases(client);
const DATABASE_ID = "68c9a6a6000cf7733309";
const COLLECTION_ID = "68c9a6b7002dfd514488";
const account = new Account(client);

interface AuthContextType {
    user: any;
    progress: any;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    verifyEmail: (userId: string, secret: string) => Promise<void>;
    resendVerification: () => Promise<void>;
    updateEmail: (newEmail: string, password: string) => Promise<void>;
    updatePassword: (newPassword: string, oldPassword: string) => Promise<void>;
    updateUserProgress: () => Promise<void>;
    updateProgressField: (field: string, value: any) => Promise<void>;
    addCompletedLesson: (certName: string, moduleId: number, lessonIndex: number, xpGained: number) => Promise<void>;
    addCompletedModule: (certName: string, moduleId: number) => Promise<void>;
    updateStreak: (newStreak: number) => Promise<void>;
    databases: Databases;
    account: Account;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await account.get();
                setUser(res);

                // Fetch progress doc
                const result = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal("userID", res.$id)]
                );

                if (result.total > 0) {
                    setProgress(result.documents[0]);
                }
            } catch {
                setUser(null);
                setProgress(null);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    // Helper function to create initial progress document with all fields
    const createInitialProgress = async (userId: string) => {
        const initialProgress = {
            userID: userId,
            currentCert: "",
            xp: 0,
            completedLessons: [],
            completedModules: [],
            maxStreakAllTime: 0,
            currentStreak: 0,
            selectedTheme: "forge",
            darkModeEnabled: true,
            enrolledCourses: [],
            dailyGoalXP: 50,
            weeklyGoalXP: 350,
            studyTimeMinutes: 0,
            averageSessionLength: 0,
            lastActiveDate: new Date().toISOString(),
            longestStudyStreak: 0,
            friendsList: [],
            friendRequests: [],
            leagueRank: 0,
            weeklyXP: 0,
            achievements: [],
            badgesEarned: [],
            mistakesReview: [],
            favoriteTopics: [],
            weakTopics: [],
            notificationsEnabled: true,
            reminderTime: "19:00",
            soundEnabled: true,
            language: "en",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        };

        return await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            initialProgress
        );
    };

    // Refresh user progress from database
    const updateUserProgress = async () => {
        if (!user) return;

        try {
            const result = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal("userID", user.$id)]
            );

            if (result.total > 0) {
                setProgress(result.documents[0]);
            }
        } catch (error) {
            console.error('Failed to update user progress:', error);
        }
    };

    // Update a specific field in the progress document
    const updateProgressField = async (field: string, value: any) => {
        if (!progress) return;

        try {
            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                progress.$id,
                { [field]: value }
            );
            setProgress(updatedDoc);
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            throw error;
        }
    };

    // Add a completed lesson and update XP
    const addCompletedLesson = async (certName: string, moduleId: number, lessonIndex: number, xpGained: number) => {
        if (!progress) return;

        const lessonKey = `${certName}_${moduleId}_${lessonIndex}`;
        const currentLessons = progress.completedLessons || [];

        // Don't add if already completed
        if (currentLessons.includes(lessonKey)) return;

        const newCompletedLessons = [...currentLessons, lessonKey];
        const newXP = (progress.xp || 0) + xpGained;
        const newWeeklyXP = (progress.weeklyXP || 0) + xpGained;

        try {
            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                progress.$id,
                {
                    completedLessons: newCompletedLessons,
                    xp: newXP,
                    weeklyXP: newWeeklyXP,
                    lastActiveDate: new Date().toISOString()
                }
            );
            setProgress(updatedDoc);
        } catch (error) {
            console.error('Failed to add completed lesson:', error);
            throw error;
        }
    };

    // Add a completed module
    const addCompletedModule = async (certName: string, moduleId: number) => {
        if (!progress) return;

        const moduleKey = `${certName}_${moduleId}`;
        const currentModules = progress.completedModules || [];

        // Don't add if already completed
        if (currentModules.includes(moduleKey)) return;

        const newCompletedModules = [...currentModules, moduleKey];

        try {
            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                progress.$id,
                {
                    completedModules: newCompletedModules,
                    lastActiveDate: new Date().toISOString()
                }
            );
            setProgress(updatedDoc);
        } catch (error) {
            console.error('Failed to add completed module:', error);
            throw error;
        }
    };

    // Update streak information
    const updateStreak = async (newStreak: number) => {
        if (!progress) return;

        const maxStreak = Math.max(progress.maxStreakAllTime || 0, newStreak);
        const longestStudyStreak = Math.max(progress.longestStudyStreak || 0, newStreak);

        try {
            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                progress.$id,
                {
                    currentStreak: newStreak,
                    maxStreakAllTime: maxStreak,
                    longestStudyStreak: longestStudyStreak,
                    lastActiveDate: new Date().toISOString()
                }
            );
            setProgress(updatedDoc);
        } catch (error) {
            console.error('Failed to update streak:', error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        setUser(user);

        // Look for existing progress doc
        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal("userID", user.$id)]
        );

        if (result.total > 0) {
            setProgress(result.documents[0]);
        } else {
            const newDoc = await createInitialProgress(user.$id);
            setProgress(newDoc);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        // Create the account
        const user = await account.create(ID.unique(), email, password, name);

        // Send verification email
        await account.createVerification('http://your-app.com/verify-email');

        // Auto-login after registration
        await account.createEmailPasswordSession(email, password);
        const loggedInUser = await account.get();
        setUser(loggedInUser);

        // Create initial progress document with all fields
        const newDoc = await createInitialProgress(user.$id);
        setProgress(newDoc);
    };

    const logout = async () => {
        await account.deleteSession("current");
        setUser(null);
        setProgress(null);
    };

    const forgotPassword = async (email: string) => {
        await account.createRecovery(
            email,
            'http://your-app.com/reset-password' // You'll need to set up deep linking for this
        );
    };

    const verifyEmail = async (userId: string, secret: string) => {
        await account.updateVerification(userId, secret);
        // Refresh user data after verification
        const updatedUser = await account.get();
        setUser(updatedUser);
    };

    const resendVerification = async () => {
        if (user) {
            await account.createVerification('http://your-app.com/verify-email');
        }
    };

    const updateEmail = async (newEmail: string, password: string) => {
        await account.updateEmail(newEmail, password);
        const updatedUser = await account.get();
        setUser(updatedUser);
    };

    const updatePassword = async (newPassword: string, oldPassword: string) => {
        await account.updatePassword(newPassword, oldPassword);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                progress,
                loading,
                login,
                register,
                logout,
                forgotPassword,
                verifyEmail,
                resendVerification,
                updateEmail,
                updatePassword,
                updateUserProgress,
                updateProgressField,
                addCompletedLesson,
                addCompletedModule,
                updateStreak,
                databases,
                account
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};