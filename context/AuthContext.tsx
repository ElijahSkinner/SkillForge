import React, { createContext, useContext, useState, useEffect } from "react";
import { Account, Client, Databases, ID, Query } from "appwrite";

const client = new Client()
    .setEndpoint("http://192.168.40.142/v1") // Tailscale IP
    .setProject("68c99e72002c3fb21bdf");
const databases = new Databases(client);
const DATABASE_ID = "68c9a6a6000cf7733309";
const COLLECTION_ID = "68c9a6b7002dfd514488";

const account = new Account(client);

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [progress, setProgress] = useState<any>(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const res = await account.get();
                setUser(res);
            } catch {
                setUser(null);
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
            // Found existing doc
            setProgress(result.documents[0]);
        } else {
            // Create new progress doc
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
                }
            );
            setProgress(newDoc);
        }
    };

    const logout = async () => {
        await account.deleteSession("current");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, progress, login, logout, databases, DATABASE_ID }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
