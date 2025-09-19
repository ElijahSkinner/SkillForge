import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import forge from "@/app/themes/forge.json";
import space from "../themes/space.json";
import ocean from "../themes/ocean.json";

const themes: Record<string, any> = {
    forge,
    space,
    ocean,
};

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState(themes.forge);

    // Load stored theme on startup
    useEffect(() => {
        (async () => {
            const stored = await AsyncStorage.getItem("theme");
            if (stored && themes[stored]) {
                setTheme(themes[stored]);
            }
        })();
    }, []);

    const changeTheme = async (name: string) => {
        if (themes[name]) {
            setTheme(themes[name]);
            await AsyncStorage.setItem("theme", name);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
