// context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { Account, Client } from "appwrite";

const client = new Client()
    .setEndpoint("http://YOUR_SERVER_IP/v1") // change to your Appwrite endpoint
    .setProject("YOUR_PROJECT_ID");

const account = new Account(client);

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        account.get()
            .then((res) => setUser(res))
            .catch(() => setUser(null));
    }, []);

    const login = async (email: string, password: string) => {
        await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        setUser(user);
    };

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
