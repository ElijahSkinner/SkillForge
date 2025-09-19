// themes/forge.ts
export const forgeTheme = {
    name: 'forge',
    userRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    colors: {
        // Base colors - Dark forge aesthetic
        background: '#0d0e12',        // Very dark blue-black (your current bg)
        surface: '#1a1b1f',          // Card/elevated surface color
        surfaceVariant: '#222222',    // Your current black

        // Primary colors - Gold/ember theme
        primary: '#ffa500',           // Orange-gold (main brand color)
        primaryDark: '#e6940a',       // Darker gold for pressed states
        primaryLight: '#ffb84d',      // Lighter gold for highlights

        // Secondary colors - Steel/metal theme
        secondary: '#708090',         // Slate gray (steel)
        secondaryDark: '#5a6b7a',     // Darker steel
        secondaryLight: '#8b9bb0',    // Lighter steel

        // Accent colors - Ember/fire theme
        accent: '#ff6b35',            // Bright ember orange
        accentDark: '#e6521f',        // Darker ember
        accentLight: '#ff8555',       // Lighter ember

        // Text colors
        text: '#ffffff',              // Primary text
        textSecondary: '#cccccc',     // Secondary text
        textMuted: '#888888',         // Muted text
        textOnPrimary: '#000000',     // Text on gold backgrounds

        // Status colors
        success: '#27b0b9',           // Your existing success (keeping)
        error: '#ff4757',             // Red for errors
        warning: '#ffa726',           // Orange for warnings
        info: '#42a5f5',              // Blue for info

        // Interactive colors
        cardBackground: '#1e1e1e',    // Cards and containers
        borderColor: '#333333',       // Borders and dividers
        ripple: 'rgba(255, 165, 0, 0.12)', // Touch feedback

        // Theme-specific forge colors
        ember: '#ff4500',             // Hot ember
        steel: '#4682b4',             // Steel blue
        copper: '#b87333',            // Copper
        bronze: '#cd7f32',            // Bronze
        silver: '#c0c0c0',            // Silver
        gold: '#ffd700',              // Pure gold
        iron: '#708090',              // Iron gray
        mithril: '#e6e6fa',           // Light mythical metal

        // League colors (for your smithable metals)
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
        // Headers
        h1: {
            fontSize: 32,
            fontWeight: '800' as const,
            color: '#ffa500',
            letterSpacing: 0.5,
        },
        h2: {
            fontSize: 28,
            fontWeight: '700' as const,
            color: '#ffa500',
            letterSpacing: 0.25,
        },
        h3: {
            fontSize: 24,
            fontWeight: '600' as const,
            color: '#ffffff',
        },
        h4: {
            fontSize: 20,
            fontWeight: '600' as const,
            color: '#ffffff',
        },

        // Body text
        body1: {
            fontSize: 16,
            fontWeight: '400' as const,
            color: '#ffffff',
            lineHeight: 24,
        },
        body2: {
            fontSize: 14,
            fontWeight: '400' as const,
            color: '#cccccc',
            lineHeight: 20,
        },

        // UI elements
        button: {
            fontSize: 16,
            fontWeight: '600' as const,
            color: '#ffffff',
            textTransform: 'uppercase' as const,
            letterSpacing: 0.75,
        },
        caption: {
            fontSize: 12,
            fontWeight: '400' as const,
            color: '#888888',
            lineHeight: 16,
        },
        overline: {
            fontSize: 10,
            fontWeight: '400' as const,
            color: '#888888',
            textTransform: 'uppercase' as const,
            letterSpacing: 1.5,
        },

        // Special forge-themed typography
        forge: {
            title: {
                fontSize: 24,
                fontWeight: '700' as const,
                color: '#ffa500',
                textShadowColor: 'rgba(255, 107, 53, 0.3)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 3,
            },
            xp: {
                fontSize: 18,
                fontWeight: '600' as const,
                color: '#ff6b35', // Ember color for XP
            },
            streak: {
                fontSize: 16,
                fontWeight: '600' as const,
                color: '#ff4500', // Hot ember for streak
            }
        }
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        xs: 4,
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        round: 999,
    },
    shadows: {
        small: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 3,
        },
        medium: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        large: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.30,
            shadowRadius: 4.65,
            elevation: 8,
        },
        // Forge-specific glowing effects
        ember: {
            shadowColor: '#ff6b35',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 5,
        },
        gold: {
            shadowColor: '#ffa500',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 4,
        }
    },
    // Forge-specific theming for gamification
    gamification: {
        // XP = Heat level of forge
        xp: {
            color: '#ff6b35',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            icon: 'flame',
        },
        // Streak = Forge flame (keep it burning)
        streak: {
            color: '#ff4500',
            backgroundColor: 'rgba(255, 69, 0, 0.1)',
            icon: 'flame-outline',
        },
        // Progress bars
        progress: {
            background: '#333333',
            fill: '#ffa500',
            fillSecondary: '#ff6b35',
        },
        // Modules = Raw materials
        modules: {
            locked: '#444444',
            available: '#708090', // Steel
            inProgress: '#ffa500', // Gold
            completed: '#27b0b9', // success color
        }
    },
    assets: {
        // These will be your theme-specific assets once organized
        logo: require('@/assets/images/new-logo.png'),
        roadmapBackground: require('@/assets/themes/forge/roadmap-bg.png'),
        // When you organize assets:
        // badge: require('@/assets/themes/forge/badge.png'),
        // hammer: require('@/assets/themes/forge/hammer.png'),
        // anvil: require('@/assets/themes/forge/anvil.png'),
    }
};