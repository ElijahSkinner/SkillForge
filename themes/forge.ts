export const forgeTheme = {
    name: 'forge',
    light: {
        colors: {
            // Base colors - Light forge aesthetic
            background: '#f5f5f5',        // Light background
            surface: '#ffffff',           // Card/elevated surface color
            surfaceVariant: '#eeeeee',    // Light variant

            // Primary colors - Gold/ember theme (same)
            primary: '#ffa500',
            primaryDark: '#e6940a',
            primaryLight: '#ffb84d',

            // Secondary colors - Steel/metal theme
            secondary: '#708090',
            secondaryDark: '#5a6b7a',
            secondaryLight: '#8b9bb0',

            // Accent colors - Ember/fire theme (same)
            accent: '#ff6b35',
            accentDark: '#e6521f',
            accentLight: '#ff8555',

            // Text colors - Dark text for light backgrounds
            text: '#212121',
            textSecondary: '#424242',
            textMuted: '#757575',
            textOnPrimary: '#000000',

            // Status colors (same)
            success: '#27b0b9',
            error: '#ff4757',
            warning: '#ffa726',
            info: '#42a5f5',

            // Interactive colors - Light variants
            cardBackground: '#ffffff',
            borderColor: '#e0e0e0',
            ripple: 'rgba(255, 165, 0, 0.12)',

            // Theme-specific forge colors (same)
            ember: '#ff4500',
            steel: '#4682b4',
            copper: '#b87333',
            bronze: '#cd7f32',
            silver: '#c0c0c0',
            gold: '#ffd700',
            iron: '#708090',
            mithril: '#e6e6fa',

            // League colors (same)
            leagues: {
                copper: '#b87333',
                bronze: '#cd7f32',
                iron: '#708090',
                steel: '#4682b4',
                silver: '#c0c0c0',
                gold: '#ffd700',
                platinum: '#e5e4e2',
                titanium: '#878681',
                adamantine: '#6e6e70',
                mithril: '#e6e6fa',
            }
        },
        typography: {
            // Headers with dark text
            h1: { fontSize: 32, fontWeight: '800' as const, color: '#212121' },
            h2: { fontSize: 28, fontWeight: '700' as const, color: '#ffa500' },
            h3: { fontSize: 24, fontWeight: '600' as const, color: '#212121' },
            h4: { fontSize: 20, fontWeight: '600' as const, color: '#212121' },
            body1: { fontSize: 16, fontWeight: '400' as const, color: '#212121', lineHeight: 24 },
            body2: { fontSize: 14, fontWeight: '400' as const, color: '#424242', lineHeight: 20 },
            button: { fontSize: 16, fontWeight: '600' as const, color: '#ffffff' },
            caption: { fontSize: 12, fontWeight: '400' as const, color: '#757575', lineHeight: 16 },
            overline: { fontSize: 10, fontWeight: '400' as const, color: '#757575', textTransform: 'uppercase' as const },
        },
        // ... rest of theme properties remain the same
    },
    dark: {
        colors: {
            // Base colors - Dark forge aesthetic (your current)
            background: '#0d0e12',
            surface: '#1a1b1f',
            surfaceVariant: '#222222',

            // Primary colors - Gold/ember theme
            primary: '#ffa500',
            primaryDark: '#e6940a',
            primaryLight: '#ffb84d',

            // Secondary colors - Steel/metal theme
            secondary: '#708090',
            secondaryDark: '#5a6b7a',
            secondaryLight: '#8b9bb0',

            // Accent colors - Ember/fire theme
            accent: '#ff6b35',
            accentDark: '#e6521f',
            accentLight: '#ff8555',

            // Text colors - Light text for dark backgrounds
            text: '#ffffff',
            textSecondary: '#cccccc',
            textMuted: '#888888',
            textOnPrimary: '#000000',

            // Status colors
            success: '#27b0b9',
            error: '#ff4757',
            warning: '#ffa726',
            info: '#42a5f5',

            // Interactive colors
            cardBackground: '#1e1e1e',
            borderColor: '#333333',
            ripple: 'rgba(255, 165, 0, 0.12)',

            // Theme-specific forge colors
            ember: '#ff4500',
            steel: '#4682b4',
            copper: '#b87333',
            bronze: '#cd7f32',
            silver: '#c0c0c0',
            gold: '#ffd700',
            iron: '#708090',
            mithril: '#e6e6fa',

            // League colors
            leagues: {
                copper: '#b87333',
                bronze: '#cd7f32',
                iron: '#708090',
                steel: '#4682b4',
                silver: '#c0c0c0',
                gold: '#ffd700',
                platinum: '#e5e4e2',
                titanium: '#878681',
                adamantine: '#6e6e70',
                mithril: '#e6e6fa',
            }
        },
        typography: {
            // Headers with light text
            h1: { fontSize: 32, fontWeight: '800' as const, color: '#ffa500' },
            h2: { fontSize: 28, fontWeight: '700' as const, color: '#ffa500' },
            h3: { fontSize: 24, fontWeight: '600' as const, color: '#ffffff' },
            h4: { fontSize: 20, fontWeight: '600' as const, color: '#ffffff' },
            body1: { fontSize: 16, fontWeight: '400' as const, color: '#ffffff', lineHeight: 24 },
            body2: { fontSize: 14, fontWeight: '400' as const, color: '#cccccc', lineHeight: 20 },
            button: { fontSize: 16, fontWeight: '600' as const, color: '#ffffff' },
            caption: { fontSize: 12, fontWeight: '400' as const, color: '#888888', lineHeight: 16 },
            overline: { fontSize: 10, fontWeight: '400' as const, color: '#888888', textTransform: 'uppercase' as const },
        },
    },
    // Shared properties (same for light and dark)
    spacing: {
        xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
    },
    borderRadius: {
        xs: 4, sm: 8, md: 12, lg: 16, xl: 24, round: 999,
    },
    shadows: {
        small: { shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
        medium: { shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
        large: { shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.30, shadowRadius: 4.65, elevation: 8 },
        ember: { shadowColor: '#ff6b35', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 },
        gold: { shadowColor: '#ffa500', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }
    },
    gamification: {
        xp: { color: '#ff6b35', backgroundColor: 'rgba(255, 107, 53, 0.1)', icon: 'flame' },
        streak: { color: '#ff4500', backgroundColor: 'rgba(255, 69, 0, 0.1)', icon: 'flame-outline' },
        progress: { background: '#333333', fill: '#ffa500', fillSecondary: '#ff6b35' },
        modules: { locked: '#444444', available: '#708090', inProgress: '#ffa500', completed: '#27b0b9' }
    },
    assets: {
        logo: require('@/assets/images/new-logo.png'),
        roadmapBackground: require('@/assets/forge/path.png'),
    }
};