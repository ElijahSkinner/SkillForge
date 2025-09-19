// app/themes/ocean.ts
export const oceanTheme = {
    name: 'ocean',
    userRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    colors: {
        // Deep ocean colors
        background: '#0d1b2a',
        surface: '#1b4965',
        surfaceVariant: '#415a77',

        // Ocean/water colors
        primary: '#006d75',           // Deep teal
        primaryDark: '#005661',       // Darker teal
        primaryLight: '#339196',      // Lighter teal

        secondary: '#1b4965',         // Ocean blue
        secondaryDark: '#0f3048',     // Darker ocean
        secondaryLight: '#375d7a',    // Lighter ocean

        accent: '#62b6cb',            // Light aqua
        accentDark: '#4a9eb5',        // Darker aqua
        accentLight: '#7ec3d4',       // Lighter aqua

        text: '#ffffff',
        textSecondary: '#bee9e8',
        textMuted: '#778da9',
        textOnPrimary: '#ffffff',

        success: '#2dd4bf',
        error: '#f87171',
        warning: '#fb923c',
        info: '#38bdf8',

        cardBackground: '#1e3a5f',
        borderColor: '#415a77',
        ripple: 'rgba(0, 109, 117, 0.12)',

        // Ocean-specific colors
        deepBlue: '#003049',
        coral: '#f77f00',
        seafoam: '#90e0ef',
        pearl: '#caf0f8',
        kelp: '#2a9d8f',

        // Match forge theme structure
        ember: '#f77f00',        // Coral (ocean equivalent of ember)
        steel: '#415a77',        // Ocean steel
        copper: '#d69e2e',       // Sea anemone
        bronze: '#b7472a',       // Rust/ship metal
        silver: '#caf0f8',       // Pearl
        gold: '#f6ad55',         // Sunset on water
        iron: '#1b4965',         // Deep sea metal
        mithril: '#e6fffa',      // Sea crystal

        leagues: {
            shallow: '#caf0f8',
            reef: '#90e0ef',
            kelp: '#2a9d8f',
            open: '#0077b6',
            deep: '#03045e',
            abyss: '#001219',
            trench: '#000814',
            hadal: '#000000',
            benthic: '#264653',
            pelagic: '#2a9d8f',
        }
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '800' as const, color: '#006d75'  },
        h2: { fontSize: 28, fontWeight: '700' as const, color: '#006d75' },
        h3: { fontSize: 24, fontWeight: '600' as const, color: '#ffffff' },
        h4: { fontSize: 20, fontWeight: '600' as const, color: '#ffffff' },
        body1: { fontSize: 16, fontWeight: '400' as const, color: '#ffffff', lineHeight: 24 },
        body2: { fontSize: 14, fontWeight: '400' as const, color: '#bee9e8', lineHeight: 20 },
        button: { fontSize: 16, fontWeight: '600' as const, color: '#ffffff' },
        caption: { fontSize: 12, fontWeight: '400' as const, color: '#778da9' },
        overline: { fontSize: 10, fontWeight: '400' as const, color: '#778da9', textTransform: 'uppercase' as const },
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    borderRadius: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, round: 999 },
    shadows: {
        small: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
        medium: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
        large: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
    },
    gamification: {
        xp: { color: '#2dd4bf', backgroundColor: 'rgba(45, 212, 191, 0.1)', icon: 'water' },
        streak: { color: '#62b6cb', backgroundColor: 'rgba(98, 182, 203, 0.1)', icon: 'waves' },
        progress: { background: '#415a77', fill: '#006d75', fillSecondary: '#62b6cb' },
        modules: { locked: '#415a77', available: '#1b4965', inProgress: '#006d75', completed: '#2dd4bf' }
    },
    assets: {
        logo: require('@/assets/images/new-logo.png'),
        roadmapBackground: require('@/assets/themes/ocean'),

    }
};