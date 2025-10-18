// app/(tabs)/league/index.tsx - FIXED FOR ALL THEMES
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

// Mock user XP data - in production this would come from your database
const MOCK_USERS = [
    { name: 'Elijah', xp: 350 },
    { name: 'Ava', xp: 1250 },
    { name: 'Liam', xp: 750 },
    { name: 'Sophia', xp: 450 },
    { name: 'Noah', xp: 50 },
    { name: 'Isabella', xp: 2800 },
    { name: 'Oliver', xp: 1900 },
];

// Define league tiers with XP thresholds
const LEAGUE_TIERS = [
    { name: 'Copper League', minXP: 0, colorKey: 'copper' },
    { name: 'Bronze League', minXP: 300, colorKey: 'bronze' },
    { name: 'Iron League', minXP: 600, colorKey: 'iron' },
    { name: 'Steel League', minXP: 1000, colorKey: 'steel' },
    { name: 'Silver League', minXP: 1500, colorKey: 'silver' },
    { name: 'Gold League', minXP: 2000, colorKey: 'gold' },
    { name: 'Platinum League', minXP: 2500, colorKey: 'platinum' },
    { name: 'Titanium League', minXP: 3000, colorKey: 'titanium' },
    { name: 'Adamantine League', minXP: 3500, colorKey: 'adamantine' },
    { name: 'Mithril League', minXP: 4000, colorKey: 'mithril' },
];

export default function LeagueScreen() {
    const { theme } = useTheme();
    const { progress } = useAuth();

    // Get league colors from current theme
    const getLeagueColor = (colorKey: string): string => {
        // Check if theme has league colors defined
        if (theme.colors.leagues && theme.colors.leagues[colorKey]) {
            return theme.colors.leagues[colorKey];
        }

        // Fallback to default league colors if theme doesn't have them
        const defaultColors: Record<string, string> = {
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
        };

        return defaultColors[colorKey] || theme.colors.primary;
    };

    // Add current user to the list
    const allUsers = progress ? [
        ...MOCK_USERS,
        { name: 'You', xp: progress.xp || 0 }
    ] : MOCK_USERS;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    padding: theme.spacing.lg,
                    paddingBottom: theme.spacing.xxl
                }}
            >
                <Text
                    style={[
                        theme.typography.h2,
                        {
                            color: theme.colors.primary,
                            marginBottom: theme.spacing.lg,
                            textAlign: "center",
                        }
                    ]}
                >
                    LEADERBOARD
                </Text>

                {LEAGUE_TIERS.map((league, index) => {
                    const leagueColor = getLeagueColor(league.colorKey);

                    // Get users in this league
                    const usersInLeague = allUsers.filter(
                        (user) =>
                            user.xp >= league.minXP &&
                            (!LEAGUE_TIERS[index + 1] || user.xp < LEAGUE_TIERS[index + 1].minXP)
                    );

                    // Sort users by XP (highest first)
                    const sortedUsers = usersInLeague.sort((a, b) => b.xp - a.xp);

                    return (
                        <View
                            key={league.name}
                            style={[
                                styles.leagueSection,
                                {
                                    backgroundColor: leagueColor + '1A', // 10% opacity
                                    borderRadius: theme.borderRadius.md,
                                    borderLeftWidth: 4,
                                    borderLeftColor: leagueColor,
                                    padding: theme.spacing.md,
                                    marginBottom: theme.spacing.md,
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    theme.typography.h3,
                                    {
                                        color: leagueColor,
                                        marginBottom: theme.spacing.sm
                                    }
                                ]}
                            >
                                {league.name}
                            </Text>

                            {sortedUsers.length === 0 ? (
                                <Text style={[
                                    theme.typography.body2,
                                    { color: theme.colors.textMuted, fontStyle: 'italic' }
                                ]}>
                                    No users in this league yet
                                </Text>
                            ) : (
                                sortedUsers.map((user, i) => (
                                    <View
                                        key={`${user.name}-${i}`}
                                        style={[
                                            styles.userRow,
                                            {
                                                borderBottomColor: theme.colors.borderColor,
                                                paddingVertical: theme.spacing.sm
                                            }
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                theme.typography.body1,
                                                {
                                                    color: leagueColor,
                                                    textAlign: "center",
                                                    fontWeight: "700",
                                                    width: 30,
                                                }
                                            ]}
                                        >
                                            {i + 1}
                                        </Text>
                                        <Text
                                            style={[
                                                theme.typography.body1,
                                                {
                                                    color: user.name === 'You' ? theme.colors.primary : theme.colors.text,
                                                    flex: 1,
                                                    fontWeight: user.name === 'You' ? '700' : '400'
                                                }
                                            ]}
                                        >
                                            {user.name}
                                        </Text>
                                        <Text
                                            style={[
                                                theme.typography.body1,
                                                {
                                                    color: theme.colors.success,
                                                    fontWeight: '600'
                                                }
                                            ]}
                                        >
                                            {user.xp} XP
                                        </Text>
                                    </View>
                                ))
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    leagueSection: {},
    userRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
    },
});