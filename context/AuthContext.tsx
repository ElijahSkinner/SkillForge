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
            const newDoc = await databases.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    userID: user.$id,
                    currentCert: "",
                    xp: 0,
                    completedLessons: [],
                    completedModules: [],
                    maxStreakAllTime: 0,
                    currentStreak: 0,
                    selectedTheme: "forge", // Add theme preference
                }
            );
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

        // Create initial progress document
        const newDoc = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                userID: user.$id,
                currentCert: "",
                xp: 0,
                completedLessons: [],
                completedModules: [],
                maxStreakAllTime: 0,
                currentStreak: 0,
                selectedTheme: "forge",
            }
        );
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