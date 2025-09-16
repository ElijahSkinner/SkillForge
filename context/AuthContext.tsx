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
        try {
            // Create session
            await account.createEmailPasswordSession(email, password);
            const currentUser = await account.get();
            setUser(currentUser);
        } catch (err) {
            console.log("Login error:", err);
            throw err;
        }
    };

    const logout = async () => {
        await account.deleteSession("current");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, progress, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
