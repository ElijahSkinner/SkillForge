import React, { createContext, useContext, useState, useEffect } from "react";
import { forgeTheme } from "@/app/themes/forge";
import { spaceTheme } from "@/app/themes/space";
import { oceanTheme } from "@/app/themes/ocean";

const themes = {
    forge: forgeTheme,
    space: spaceTheme,
    ocean: oceanTheme,
};

type ThemeName = keyof typeof themes;
type Theme = typeof themes.forge;

interface ThemeContextType {
    theme: Theme;
    themeName: ThemeName;
    changeTheme: (name: ThemeName) => Promise<void>;
    availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeName, setThemeName] = useState<ThemeName>('forge');
    const [theme, setTheme] = useState<Theme>(themes.forge);

    // TODO: Move this to Appwrite user preferences later
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
                const stored = await AsyncStorage.getItem("theme");
                if (stored && stored in themes) {
                    const storedTheme = stored as ThemeName;
                    setThemeName(storedTheme);
                    setTheme(themes[storedTheme]);
                }
            } catch (error) {=
                console.log("Could not load theme preference:", error);
            }
        };
        loadTheme();
    }, []);

    const changeTheme = async (name: ThemeName) => {
        if (themes[name]) {
            setThemeName(name);
            setTheme(themes[name]);

            // TODO: Save to Appwrite user preferences instead
            try {
                const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
                await AsyncStorage.setItem("theme", name);
            } catch (error) {
                console.log("Could not save theme preference:", error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            themeName,
            changeTheme,
            availableThemes: Object.keys(themes) as ThemeName[]
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};