import React, { createContext, useContext, useState, useEffect } from "react";
import { forgeTheme } from "@/app/themes/forge";
import { spaceTheme } from "@/app/themes/space";
import { oceanTheme } from "@/app/themes/ocean";

// Define the base theme type structure that all themes must follow
type BaseTheme = {
    name: string;
    colors: {
        background: string;
        surface: string;
        surfaceVariant: string;
        primary: string;
        primaryDark: string;
        primaryLight: string;
        secondary: string;
        secondaryDark: string;
        secondaryLight: string;
        accent: string;
        accentDark: string;
        accentLight: string;
        text: string;
        textSecondary: string;
        textMuted: string;
        textOnPrimary: string;
        success: string;
        error: string;
        warning: string;
        info: string;
        cardBackground: string;
        borderColor: string;
        ripple: string;
        [key: string]: any; // Allow additional theme-specific colors
    };
    typography: {
        [key: string]: any; // Flexible typography structure
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    borderRadius: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        round: number;
    };
    shadows: {
        [key: string]: any;
    };
    gamification: {
        [key: string]: any;
    };
    assets: {
        [key: string]: any;
    };
};

const themes: Record<string, BaseTheme> = {
    forge: forgeTheme as BaseTheme,
    space: spaceTheme as BaseTheme,
    ocean: oceanTheme as BaseTheme,
};

type ThemeName = keyof typeof themes;

interface ThemeContextType {
    theme: BaseTheme;
    themeName: ThemeName;
    changeTheme: (name: ThemeName) => Promise<void>;
    availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeName, setThemeName] = useState<ThemeName>('forge');
    const [theme, setTheme] = useState<BaseTheme>(themes.forge);

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
            } catch (error) {
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