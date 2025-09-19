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
    const [theme, setTheme] = useState<ThemeStructure>(themes.forge.dark as ThemeStructure);

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