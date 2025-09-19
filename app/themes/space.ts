// app/themes/space.ts
export const spaceTheme = {
    name: 'space',
    colors: {
        // Deep space colors
        background: '#0a0a0f',
        surface: '#1a1a2e',
        surfaceVariant: '#16213e',

        // Nebula/cosmic colors
        primary: '#4a90e2',           // Cosmic blue
        primaryDark: '#357abd',       // Darker cosmic blue
        primaryLight: '#66a3e8',      // Lighter cosmic blue

        secondary: '#2d3748',         // Space gray
        secondaryDark: '#1a202c',     // Darker space gray
        secondaryLight: '#4a5568',    // Lighter space gray

        accent: '#9f7aea',            // Purple nebula
        accentDark: '#805ad5',        // Darker purple
        accentLight: '#b794f6',       // Lighter purple

        text: '#ffffff',
        textSecondary: '#cbd5e0',
        textMuted: '#718096',
        textOnPrimary: '#ffffff',

        success: '#48bb78',
        error: '#f56565',
        warning: '#ed8936',
        info: '#4299e1',

        cardBackground: '#1a202c',
        borderColor: '#2d3748',
        ripple: 'rgba(74, 144, 226, 0.12)',

        // Space-specific colors
        starlight: '#f7fafc',
        nebula: '#9f7aea',
        plasma: '#4fd1c7',
        cosmic: '#4a90e2',
        asteroid: '#718096',

        // Match forge theme structure
        ember: '#9f7aea',        // Purple nebula (space equivalent)
        steel: '#718096',        // Asteroid gray
        copper: '#d69e2e',       // Solar flare
        bronze: '#ed8936',       // Mars surface
        silver: '#e2e8f0',       // Starlight
        gold: '#f6e05e',         // Solar
        iron: '#4a5568',         // Space metal
        mithril: '#e6fffa',      // Cosmic crystal

        leagues: {
            mercury: '#8c7853',
            venus: '#ffc649',
            earth: '#6b93d6',
            mars: '#cd5c5c',
            jupiter: '#d8ca9d',
            saturn: '#fad5a5',
            uranus: '#4fd0e7',
            neptune: '#4b70dd',
            pluto: '#9ca3af',
            alpha: '#9f7aea',
        }
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '800' as const, color: '#4a90e2' },
        h2: { fontSize: 28, fontWeight: '700' as const, color: '#4a90e2' },
        h3: { fontSize: 24, fontWeight: '600' as const, color: '#ffffff' },
        h4: { fontSize: 20, fontWeight: '600' as const, color: '#ffffff' },
        body1: { fontSize: 16, fontWeight: '400' as const, color: '#ffffff', lineHeight: 24 },
        body2: { fontSize: 14, fontWeight: '400' as const, color: '#cbd5e0', lineHeight: 20 },
        button: { fontSize: 16, fontWeight: '600' as const, color: '#ffffff' },
        caption: { fontSize: 12, fontWeight: '400' as const, color: '#718096' },
        overline: { fontSize: 10, fontWeight: '400' as const, color: '#718096', textTransform: 'uppercase' as const },
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    borderRadius: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, round: 999 },
    shadows: {
        small: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
        medium: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
        large: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
    },
    gamification: {
        xp: { color: '#4fd1c7', backgroundColor: 'rgba(79, 209, 199, 0.1)', icon: 'rocket' },
        streak: { color: '#9f7aea', backgroundColor: 'rgba(159, 122, 234, 0.1)', icon: 'radio' },
        progress: { background: '#2d3748', fill: '#4a90e2', fillSecondary: '#9f7aea' },
        modules: { locked: '#2d3748', available: '#4a5568', inProgress: '#4a90e2', completed: '#48bb78' }
    },
    assets: {
        logo: require('@/assets/images/new-logo.png'),
    }
};