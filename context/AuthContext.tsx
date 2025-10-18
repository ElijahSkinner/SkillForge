// context/AuthContext.tsx - UPDATED with JSON stringify/parse for Appwrite
import React, { createContext, useContext, useState, useEffect } from "react";
import { Account, Client, Databases, ID, Query } from "appwrite";
import { streakService } from "../services/StreakService";
import { backgroundStreakService } from "../services/BackgroundStreakService";
import appConfig from "../config/AppConfig";

const client = new Client()
    .setEndpoint(appConfig.appwrite.endpoint)
    .setProject(appConfig.appwrite.projectId);

const databases = new Databases(client);
const account = new Account(client);

const DATABASE_ID = appConfig.appwrite.databaseId;
const COLLECTION_ID = appConfig.appwrite.collectionId;

if (!appConfig.validateConfig()) {
    console.error('Invalid Appwrite configuration. App may not function correctly.');
}

interface MistakeItem {
    questionId: string;
    question: string;
    objective: string;
    module: string;
    yourAnswer: string;
    correctAnswer: string;
    explanation: string;
    timestamp: string;
}

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
    addCompletedQuiz: (certName: string, moduleId: number, lessonIndex: number, quizType: string, score: number) => Promise<void>;
    savePracticeScore: (certName: string, moduleId: number, lessonIndex: number, score: number) => Promise<void>;
    addMistakeToReview: (mistake: MistakeItem) => Promise<void>;
    updateStreak: (newStreak: number) => Promise<void>;
    databases: Databases;
    account: Account;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ============================================
// HELPER FUNCTIONS FOR JSON HANDLING
// ============================================

/**
 * Parse a field from Appwrite that might be JSON stringified
 * Handles both string arrays and JSON objects
 */
function parseAppwriteField(field: any, defaultValue: any = null): any {
    if (field === null || field === undefined) {
        return defaultValue;
    }

    // If it's already an object/array, return as-is
    if (typeof field === 'object') {
        return field;
    }

    // If it's a string array from Appwrite, try to parse each item
    if (Array.isArray(field)) {
        return field.map(item => {
            if (typeof item === 'string') {
                try {
                    return JSON.parse(item);
                } catch {
                    return item; // Return as-is if not JSON
                }
            }
            return item;
        });
    }

    // If it's a single string, try to parse it
    if (typeof field === 'string') {
        try {
            return JSON.parse(field);
        } catch {
            return field; // Return as-is if not JSON
        }
    }

    return field;
}

/**
 * Prepare data for Appwrite by stringifying complex objects
 */
function prepareForAppwrite(value: any): any {
    if (value === null || value === undefined) {
        return value;
    }

    // If it's an array of objects, stringify each object
    if (Array.isArray(value)) {
        // Check if array contains objects (not primitives)
        if (value.length > 0 && typeof value[0] === 'object') {
            return value.map(item => JSON.stringify(item));
        }
        return value; // Return primitive arrays as-is
    }

    // If it's an object (but not array), stringify it
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    // Primitives return as-is
    return value;
}

/**
 * Transform document from Appwrite to application format
 * Parses all JSON fields automatically
 */
function transformFromAppwrite(doc: any): any {
    if (!doc) return null;

    return {
        ...doc,
        // Parse JSON fields
        mistakesReview: parseAppwriteField(doc.mistakesReview, []),
        achievements: parseAppwriteField(doc.achievements, []),
        badgesEarned: parseAppwriteField(doc.badgesEarned, []),
        practiceScores: parseAppwriteField(doc.practiceScores, {}),
        // Keep string arrays as-is
        completedLessons: doc.completedLessons || [],
        completedModules: doc.completedModules || [],
        completedQuizzes: doc.completedQuizzes || [],
        enrolledCourses: doc.enrolledCourses || [],
        viewedLessonContent: doc.viewedLessonContent || [],
        friendsList: doc.friendsList || [],
        friendRequests: doc.friendRequests || [],
        favoriteTopics: doc.favoriteTopics || [],
        weakTopics: doc.weakTopics || [],
    };
}

// ============================================
// AUTH PROVIDER COMPONENT
// ============================================

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (progress) {
            streakService.initialize(updateProgressField);
            backgroundStreakService.initialize(() => progress);
        }
    }, [progress]);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await account.get();
                setUser(res);

                const result = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal("userID", res.$id)]
                );

                if (result.total > 0) {
                    // Transform the document from Appwrite format
                    const transformedDoc = transformFromAppwrite(result.documents[0]);
                    setProgress(transformedDoc);
                }
            } catch (error) {
                if (appConfig.isDev) {
                    console.log('No active session found:', error);
                }
                setUser(null);
                setProgress(null);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const waitForProgressDocument = async (userId: string, maxRetries = 5, delay = 1000) => {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const result = await databases.listDocuments(
                    DATABASE_ID,
                    COLLECTION_ID,
                    [Query.equal("userID", userId)]
                );

                if (result.total > 0) {
                    return transformFromAppwrite(result.documents[0]);
                }

                await new Promise(resolve => setTimeout(resolve, delay));
            } catch (error) {
                console.error(`Attempt ${i + 1} to fetch progress document failed:`, error);
                if (i === maxRetries - 1) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        console.warn('Function did not create progress document, creating manually...');
        return await createInitialProgress(userId);
    };

    const createInitialProgress = async (userId: string) => {
        const initialProgress = {
            userID: userId,
            currentCert: "",
            xp: 0,
            completedLessons: [],
            completedModules: [],
            completedQuizzes: [],
            viewedLessonContent: [],
            practiceScores: JSON.stringify({}), // Stringify for Appwrite
            mistakesReview: [], // Will be stringified when items are added
            masteredObjectives: [],
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
            achievements: [], // Will be stringified when items are added
            badgesEarned: [], // Will be stringified when items are added
            favoriteTopics: [],
            weakTopics: [],
            notificationsEnabled: true,
            reminderTime: "19:00",
            soundEnabled: true,
            language: "en",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        };

        const doc = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            initialProgress
        );

        return transformFromAppwrite(doc);
    };

    const updateUserProgress = async () => {
        if (!user) return;

        try {
            const result = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID,
                [Query.equal("userID", user.$id)]
            );

            if (result.total > 0) {
                const transformedDoc = transformFromAppwrite(result.documents[0]);
                setProgress(transformedDoc);
            }
        } catch (error) {
            console.error('Failed to update user progress:', error);
        }
    };

    const updateProgressField = async (field: string, value: any) => {
        if (!progress) return;

        try {
            // Prepare value for Appwrite (stringify if needed)
            const preparedValue = prepareForAppwrite(value);

            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                progress.$id,
                { [field]: preparedValue }
            );

            // Transform back to application format
            const transformedDoc = transformFromAppwrite(updatedDoc);
            setProgress(transformedDoc);
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            throw error;
        }
    };

    const addCompletedLesson = async (certName: string, moduleId: number, lessonIndex: number, xpGained: number) => {
        if (!progress) return;

        const lessonKey = `${certName}_${moduleId}_${lessonIndex}`;
        const currentLessons = progress.completedLessons || [];

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

            const transformedDoc = transformFromAppwrite(updatedDoc);
            setProgress(transformedDoc);
            await backgroundStreakService.onUserActivity();
        } catch (error) {
            console.error('Failed to add completed lesson:', error);
            throw error;
        }
    };

    const addCompletedModule = async (certName: string, moduleId: number) => {
        if (!progress) return;

        const moduleKey = `${certName}_${moduleId}`;
        const currentModules = progress.completedModules || [];

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

            const transformedDoc = transformFromAppwrite(updatedDoc);
            setProgress(transformedDoc);
        } catch (error) {
            console.error('Failed to add completed module:', error);
            throw error;
        }
    };

    const addCompletedQuiz = async (
        certName: string,
        moduleId: number,
        lessonIndex: number,
        quizType: string,
        score: number
    ) => {
        if (!progress) return;

        if (quizType !== 'practice' && score < 70) {
            console.log('Quiz score below 70%, not tracking completion');
            return;
        }

        const quizKey = `${certName}_${moduleId}_${lessonIndex}_${quizType}`;
        const currentQuizzes = progress.completedQuizzes || [];

        if (currentQuizzes.includes(quizKey)) {
            console.log('Quiz already completed:', quizKey);
            return;
        }

        const newCompletedQuizzes = [...currentQuizzes, quizKey];

        try {
            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                progress.$id,
                {
                    completedQuizzes: newCompletedQuizzes,
                    lastActiveDate: new Date().toISOString()
                }
            );

            const transformedDoc = transformFromAppwrite(updatedDoc);
            setProgress(transformedDoc);
            console.log('✅ Quiz completion tracked:', quizKey);
        } catch (error) {
            console.error('Failed to add completed quiz:', error);
            throw error;
        }
    };

    const savePracticeScore = async (
        certName: string,
        moduleId: number,
        lessonIndex: number,
        score: number
    ) => {
        if (!progress) return;

        const practiceKey = `${certName}_${moduleId}_${lessonIndex}_practice`;
        const currentScores = progress.practiceScores || {};

        try {
            const updatedScores = {
                ...currentScores,
                [practiceKey]: score
            };

            // Stringify the entire practiceScores object
            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                progress.$id,
                {
                    practiceScores: JSON.stringify(updatedScores),
                    lastActiveDate: new Date().toISOString()
                }
            );

            const transformedDoc = transformFromAppwrite(updatedDoc);
            setProgress(transformedDoc);
            console.log('✅ Practice score saved:', practiceKey, score);
        } catch (error) {
            console.error('Failed to save practice score:', error);
            throw error;
        }
    };

    const addMistakeToReview = async (mistake: MistakeItem) => {
        if (!progress) return;

        const currentMistakes = progress.mistakesReview || [];
        const updatedMistakes = [mistake, ...currentMistakes].slice(0, 50);

        try {
            // Stringify each mistake object for Appwrite
            const stringifiedMistakes = updatedMistakes.map(m => JSON.stringify(m));

            const updatedDoc = await databases.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                progress.$id,
                {
                    mistakesReview: stringifiedMistakes
                }
            );

            const transformedDoc = transformFromAppwrite(updatedDoc);
            setProgress(transformedDoc);
            console.log('✅ Mistake added to review');
        } catch (error) {
            console.error('Failed to add mistake to review:', error);
            throw error;
        }
    };

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

            const transformedDoc = transformFromAppwrite(updatedDoc);
            setProgress(transformedDoc);
        } catch (error) {
            console.error('Failed to update streak:', error);
            throw error;
        }
    };

    const login = async (email: string, password: string) => {
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        setUser(user);

        const result = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal("userID", user.$id)]
        );

        if (result.total > 0) {
            const transformedDoc = transformFromAppwrite(result.documents[0]);
            setProgress(transformedDoc);
        } else {
            const newDoc = await createInitialProgress(user.$id);
            setProgress(newDoc);
        }
    };

    const register = async (email: string, password: string, name: string) => {
        const user = await account.create(ID.unique(), email, password, name);
        await account.createEmailPasswordSession(email, password);
        const loggedInUser = await account.get();
        setUser(loggedInUser);

        try {
            const progressDoc = await waitForProgressDocument(loggedInUser.$id);
            setProgress(progressDoc);
        } catch (error) {
            console.error('Failed to get progress document:', error);
            throw new Error('Failed to initialize user progress. Please try again.');
        }
    };

    const logout = async () => {
        await account.deleteSession("current");
        setUser(null);
        setProgress(null);
    };

    const forgotPassword = async (email: string) => {
        await account.createRecovery(
            email,
            `${appConfig.app.deepLinkUrl}/reset-password`
        );
    };

    const verifyEmail = async (userId: string, secret: string) => {
        await account.updateVerification(userId, secret);
        const updatedUser = await account.get();
        setUser(updatedUser);
    };

    const resendVerification = async () => {
        if (user) {
            await account.createVerification(`${appConfig.app.deepLinkUrl}/verify-email`);
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
                addCompletedQuiz,
                savePracticeScore,
                addMistakeToReview,
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