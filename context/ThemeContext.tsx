import React, { createContext, useContext, useState, useEffect } from "react";
import { forgeTheme } from "@/app/themes/forge";
import { spaceTheme } from "@/app/themes/space";
import { oceanTheme } from "@/app/themes/ocean";
import { useAuth } from "@/context/AuthContext";

const themes = {
    forge: forgeTheme,
    space: spaceTheme,
    ocean: oceanTheme,
};

type ThemeName = keyof typeof themes;

// Define proper theme structure for TypeScript
interface ThemeStructure {
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
        [key: string]: any; // Allow additional colors
    };
    typography: {
        [key: string]: any;
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
}

interface ThemeContextType {
    theme: ThemeStructure;
    themeName: ThemeName;
    isDarkMode: boolean;
    changeTheme: (name: ThemeName) => Promise<void>;
    toggleDarkMode: () => Promise<void>;
    availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { progress, updateProgressField } = useAuth();
    const [themeName, setThemeName] = useState<ThemeName>('forge');
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Initialize with a fallback theme to prevent undefined errors
    const [theme, setTheme] = useState<ThemeStructure>(() => {
        // Create a basic fallback theme structure
        return {
            colors: {
                background: '#0d0e12',
                surface: '#1a1b1f',
                surfaceVariant: '#222222',
                primary: '#ffa500',
                primaryDark: '#e6940a',
                primaryLight: '#ffb84d',
                secondary: '#708090',
                secondaryDark: '#5a6b7a',
                secondaryLight: '#8b9bb0',
                accent: '#ff6b35',
                accentDark: '#e6521f',
                accentLight: '#ff8555',
                text: '#ffffff',
                textSecondary: '#cccccc',
                textMuted: '#888888',
                textOnPrimary: '#000000',
                success: '#27b0b9',
                error: '#ff4757',
                warning: '#ffa726',
                info: '#42a5f5',
                cardBackground: '#1e1e1e',
                borderColor: '#333333',
                ripple: 'rgba(255, 165, 0, 0.12)',
            },
            typography: {
                h1: { fontSize: 32, fontWeight: '800' as const, color: '#ffa500' },
                h2: { fontSize: 28, fontWeight: '700' as const, color: '#ffa500' },
                h3: { fontSize: 24, fontWeight: '600' as const, color: '#ffffff' },
                h4: { fontSize: 20, fontWeight: '600' as const, color: '#ffffff' },
                body1: { fontSize: 16, fontWeight: '400' as const, color: '#ffffff', lineHeight: 24 },
                body2: { fontSize: 14, fontWeight: '400' as const, color: '#cccccc', lineHeight: 20 },
                button: { fontSize: 16, fontWeight: '600' as const, color: '#ffffff' },
                caption: { fontSize: 12, fontWeight: '400' as const, color: '#888888' },
                overline: { fontSize: 10, fontWeight: '400' as const, color: '#888888', textTransform: 'uppercase' as const },
            },
            spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
            borderRadius: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, round: 999 },
            shadows: {
                small: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
                medium: { shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
                large: { shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
            },
            gamification: {},
            assets: {},
        };
    });

    // Load theme preferences from Appwrite when user data is available
    useEffect(() => {
        if (progress) {
            const savedTheme = progress.selectedTheme || 'forge';
            const savedDarkMode = progress.darkModeEnabled !== undefined ? progress.darkModeEnabled : true;

            if (savedTheme in themes) {
                setThemeName(savedTheme as ThemeName);
                setIsDarkMode(savedDarkMode);
                updateCurrentTheme(savedTheme as ThemeName, savedDarkMode);
            }
        }
    }, [progress]);

    // Helper function to update the current active theme
    const updateCurrentTheme = (name: ThemeName, darkMode: boolean) => {
        const selectedTheme = themes[name] as any;
        const themeVariant = darkMode ? selectedTheme.dark : selectedTheme.light;

        // Merge shared properties with the light/dark variant
        const mergedTheme: ThemeStructure = {
            colors: themeVariant.colors,
            typography: themeVariant.typography,
            spacing: selectedTheme.spacing,
            borderRadius: selectedTheme.borderRadius,
            shadows: selectedTheme.shadows,
            gamification: selectedTheme.gamification,
            assets: selectedTheme.assets,
        };

        setTheme(mergedTheme);
    };

    const changeTheme = async (name: ThemeName) => {
        if (themes[name]) {
            setThemeName(name);
            updateCurrentTheme(name, isDarkMode);

            // Save to Appwrite
            try {
                await updateProgressField('selectedTheme', name);
            } catch (error) {
                console.log("Could not save theme preference:", error);
            }
        }
    };

    const toggleDarkMode = async () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        updateCurrentTheme(themeName, newDarkMode);

        // Save to Appwrite
        try {
            await updateProgressField('darkModeEnabled', newDarkMode);
        } catch (error) {
            console.log("Could not save dark mode preference:", error);
        }
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            themeName,
            isDarkMode,
            changeTheme,
            toggleDarkMode,
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