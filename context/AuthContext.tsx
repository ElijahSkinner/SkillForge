// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Account, Client } from "appwrite";

// Initialize Appwrite client
const client = new Client()
    .setEndpoint("http://192.168.40.142/v1")
    .setProject("68c99e72002c3fb21bdf");

const account = new Account(client);

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);

    // Check for existing session on mount
    useEffect(() => {
        account.get()
            .then((res) => setUser(res))
            .catch(() => setUser(null));
    }, []);

    // Login with email/password
    const login = async (email: string, password: string) => {
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        setUser(user);
    };

    // Logout
    const logout = async () => {
        await account.deleteSession("current");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
