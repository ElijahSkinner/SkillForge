export const oceanTheme = {
    name: 'ocean',
    light: {
        colors: {
            background: '#f0f9ff',        // Very light blue
            surface: '#ffffff',
            surfaceVariant: '#e0f2fe',
            primary: '#0891b2',           // Cyan
            primaryDark: '#0e7490',
            primaryLight: '#22d3ee',
            secondary: '#64748b',
            secondaryDark: '#475569',
            secondaryLight: '#94a3b8',
            accent: '#06b6d4',
            accentDark: '#0891b2',
            accentLight: '#67e8f9',
            text: '#0c4a6e',              // Dark blue text
            textSecondary: '#075985',
            textMuted: '#0369a1',
            textOnPrimary: '#ffffff',
            success: '#059669',
            error: '#dc2626',
            warning: '#d97706',
            info: '#0284c7',
            cardBackground: '#ffffff',
            borderColor: '#bae6fd',
            ripple: 'rgba(8, 145, 178, 0.12)',
            // Ocean specific colors
            deepBlue: '#1e40af',
            coral: '#f97316',
            seafoam: '#34d399',
            pearl: '#f8fafc',
            kelp: '#059669',
        },
        typography: {
            h1: { fontSize: 32, fontWeight: '800' as const, color: '#0c4a6e' },
            h2: { fontSize: 28, fontWeight: '700' as const, color: '#0891b2' },
            h3: { fontSize: 24, fontWeight: '600' as const, color: '#0c4a6e' },
            h4: { fontSize: 20, fontWeight: '600' as const, color: '#0c4a6e' },
            body1: { fontSize: 16, fontWeight: '400' as const, color: '#0c4a6e', lineHeight: 24 },
            body2: { fontSize: 14, fontWeight: '400' as const, color: '#075985', lineHeight: 20 },
            button: { fontSize: 16, fontWeight: '600' as const, color: '#ffffff' },
            caption: { fontSize: 12, fontWeight: '400' as const, color: '#0369a1' },
            overline: { fontSize: 10, fontWeight: '400' as const, color: '#0369a1', textTransform: 'uppercase' as const },
        }
    },
    dark: {
        colors: {
            background: '#0d1b2a',
            surface: '#1b4965',
            surfaceVariant: '#415a77',
            primary: '#006d75',
            primaryDark: '#005661',
            primaryLight: '#339196',
            secondary: '#1b4965',
            secondaryDark: '#0f3048',
            secondaryLight: '#375d7a',
            accent: '#62b6cb',
            accentDark: '#4a9eb5',
            accentLight: '#7ec3d4',
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
            // Ocean specific colors
            deepBlue: '#003049',
            coral: '#f77f00',
            seafoam: '#90e0ef',
            pearl: '#caf0f8',
            kelp: '#2a9d8f',
        },
        typography: {
            h1: { fontSize: 32, fontWeight: '800' as const, color: '#006d75' },
            h2: { fontSize: 28, fontWeight: '700' as const, color: '#006d75' },
            h3: { fontSize: 24, fontWeight: '600' as const, color: '#ffffff' },
            h4: { fontSize: 20, fontWeight: '600' as const, color: '#ffffff' },
            body1: { fontSize: 16, fontWeight: '400' as const, color: '#ffffff', lineHeight: 24 },
            body2: { fontSize: 14, fontWeight: '400' as const, color: '#bee9e8', lineHeight: 20 },
            button: { fontSize: 16, fontWeight: '600' as const, color: '#ffffff' },
            caption: { fontSize: 12, fontWeight: '400' as const, color: '#778da9' },
            overline: { fontSize: 10, fontWeight: '400' as const, color: '#778da9', textTransform: 'uppercase' as const },
        }
    },
    // Shared properties same structure...
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    borderRadius: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, round: 999 },
    shadows: {
        small: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
        medium: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
        large: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 }
    },
    gamification: {
        xp: { color: '#2dd4bf', backgroundColor: 'rgba(45, 212, 191, 0.1)', icon: 'water' },
        streak: { color: '#62b6cb', backgroundColor: 'rgba(98, 182, 203, 0.1)', icon: 'waves' },
        progress: { background: '#415a77', fill: '#006d75', fillSecondary: '#62b6cb' },
        modules: { locked: '#415a77', available: '#1b4965', inProgress: '#006d75', completed: '#2dd4bf' }
    },
    assets: { logo: require('@/assets/images/new-logo.png') }
};