import React, { createContext, useContext, useState, useEffect } from "react";
import { forgeTheme } from "@/app/themes/forge";
// We'll create these properly
// import { spaceTheme } from "@/app/themes/space";
// import { oceanTheme } from "@/app/themes/ocean";

// For now, let's create placeholder themes until you build the full ones
const spaceTheme = {
    name: 'space',
    colors: {
        background: '#0a0a0f',
        primary: '#4a90e2',
        secondary: '#2d3748',
        accent: '#63b3ed',
        text: '#ffffff',
        textSecondary: '#a0aec0',
        success: '#27b0b9',
        error: '#ff4d4d',
    },
    typography: {
        title: { fontSize: 24, fontWeight: 'bold' as const },
        subtitle: { fontSize: 18, fontWeight: '600' as const },
        body: { fontSize: 16, fontWeight: 'normal' as const },
        caption: { fontSize: 14, fontWeight: 'normal' as const },
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    assets: {},
};

const oceanTheme = {
    name: 'ocean',
    colors: {
        background: '#0d1b2a',
        primary: '#006d75',
        secondary: '#1b4965',
        accent: '#62b6cb',
        text: '#ffffff',
        textSecondary: '#bee9e8',
        success: '#27b0b9',
        error: '#ff4d4d',
    },
    typography: {
        title: { fontSize: 24, fontWeight: 'bold' as const },
        subtitle: { fontSize: 18, fontWeight: '600' as const },
        body: { fontSize: 16, fontWeight: 'normal' as const },
        caption: { fontSize: 14, fontWeight: 'normal' as const },
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
    assets: {},
};

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

    // TODO: Load from Appwrite user preferences instead of AsyncStorage
    useEffect(() => {
        // For now, keeping AsyncStorage but you should migrate this to Appwrite
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

            // TODO: Save to Appwrite user preferences
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