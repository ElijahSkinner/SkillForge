// app/themes/space.ts
export const spaceTheme = {
    name: 'space',
    light: {
        colors: {
            background: '#f8fafc',        // Very light blue-gray
            surface: '#ffffff',
            surfaceVariant: '#f1f5f9',
            primary: '#3b82f6',           // Bright blue
            primaryDark: '#2563eb',
            primaryLight: '#60a5fa',
            secondary: '#64748b',         // Slate
            secondaryDark: '#475569',
            secondaryLight: '#94a3b8',
            accent: '#8b5cf6',            // Purple
            accentDark: '#7c3aed',
            accentLight: '#a78bfa',
            text: '#0f172a',              // Dark text
            textSecondary: '#334155',
            textMuted: '#64748b',
            textOnPrimary: '#ffffff',
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6',
            cardBackground: '#ffffff',
            borderColor: '#e2e8f0',
            ripple: 'rgba(59, 130, 246, 0.12)',
            // Space specific colors
            starlight: '#1e293b',
            nebula: '#8b5cf6',
            plasma: '#06b6d4',
            cosmic: '#3b82f6',
            asteroid: '#64748b',
        },
        typography: {
            h1: { fontSize: 32, fontWeight: '800' as const, color: '#0f172a' },
            h2: { fontSize: 28, fontWeight: '700' as const, color: '#3b82f6' },
            h3: { fontSize: 24, fontWeight: '600' as const, color: '#0f172a' },
            h4: { fontSize: 20, fontWeight: '600' as const, color: '#0f172a' },
            body1: { fontSize: 16, fontWeight: '400' as const, color: '#0f172a', lineHeight: 24 },
            body2: { fontSize: 14, fontWeight: '400' as const, color: '#334155', lineHeight: 20 },
            button: { fontSize: 16, fontWeight: '600' as const, color: '#ffffff' },
            caption: { fontSize: 12, fontWeight: '400' as const, color: '#64748b' },
            overline: { fontSize: 10, fontWeight: '400' as const, color: '#64748b', textTransform: 'uppercase' as const },
        }
    },
    dark: {
        colors: {
            background: '#0a0a0f',
            surface: '#1a1a2e',
            surfaceVariant: '#16213e',
            primary: '#4a90e2',
            primaryDark: '#357abd',
            primaryLight: '#66a3e8',
            secondary: '#2d3748',
            secondaryDark: '#1a202c',
            secondaryLight: '#4a5568',
            accent: '#9f7aea',
            accentDark: '#805ad5',
            accentLight: '#b794f6',
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
            // Space specific colors
            starlight: '#f7fafc',
            nebula: '#9f7aea',
            plasma: '#4fd1c7',
            cosmic: '#4a90e2',
            asteroid: '#718096',
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
        }
    },
    // Shared properties same as forge...
    spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
    borderRadius: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, round: 999 },
    shadows: {
        small: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
        medium: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
        large: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 }
    },
    gamification: {
        xp: { color: '#4fd1c7', backgroundColor: 'rgba(79, 209, 199, 0.1)', icon: 'rocket' },
        streak: { color: '#9f7aea', backgroundColor: 'rgba(159, 122, 234, 0.1)', icon: 'radio' },
        progress: { background: '#2d3748', fill: '#4a90e2', fillSecondary: '#9f7aea' },
        modules: { locked: '#2d3748', available: '#4a5568', inProgress: '#4a90e2', completed: '#48bb78' }
    },
    assets: { logo: require('@/assets/images/new-logo.png') }
};
