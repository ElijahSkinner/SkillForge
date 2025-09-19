import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from '@/context/ThemeContext';

// Mock user XP data
const MOCK_USERS = [
    { name: 'Elijah', xp: 350 },
    { name: 'Ava', xp: 1250 },
    { name: 'Liam', xp: 750 },
    { name: 'Sophia', xp: 450 },
    { name: 'Noah', xp: 50 },
    { name: 'Isabella', xp: 2800 },
    { name: 'Oliver', xp: 1900 },
];

export default function LeagueScreen() {
    const { theme } = useTheme();

    // Build leagues dynamically from theme
    const LEAGUES = Object.entries(theme.colors.leagues).map(
        ([key, color], index) => ({
            name: `${key.charAt(0).toUpperCase() + key.slice(1)} League`,
            color,
            minXP: index * 300, // you can adjust spacing logic here
        })
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1, backgroundColor: theme.colors.background }}
                contentContainerStyle={{ padding: 20, paddingBottom: 30 }}
            >
                <Text
                    style={{
                        fontSize: 26,
                        fontWeight: "700",
                        color: theme.colors.primary,
                        marginBottom: 20,
                        textAlign: "center",
                    }}
                >
                    LEADERBOARD
                </Text>

                {LEAGUES.map((league, index) => {
                    const usersInLeague = MOCK_USERS.filter(
                        (user) =>
                            user.xp >= league.minXP &&
                            (!LEAGUES[index + 1] || user.xp < LEAGUES[index + 1].minXP)
                    );

                    return (
                        <View
                            key={league.name}
                            style={[
                                styles.leagueSection,
                                { backgroundColor: league.color + "33" },
                            ]}
                        >
                            <Text style={[theme.typography.h3, { color: league.color }]}>
                                {league.name}
                            </Text>

                            {usersInLeague.length === 0 ? (
                                <Text style={{ color: theme.colors.warning }}>
                                    No users in this league yet
                                </Text>
                            ) : (
                                usersInLeague
                                    .sort((a, b) => b.xp - a.xp)
                                    .map((user, i) => (
                                        <View
                                            key={user.name}
                                            style={[
                                                styles.userRow,
                                                { borderBottomColor: theme.colors.border },
                                            ]}
                                        >
                                            <Text
                                                style={{
                                                    color: theme.colors.text,
                                                    textAlign: "center",
                                                    fontWeight: "600",
                                                    width: 30,
                                                }}
                                            >
                                                {i + 1}
                                            </Text>
                                            <Text style={{ color: theme.colors.text, flex: 1 }}>
                                                {user.name}
                                            </Text>
                                            <Text style={{ color: theme.colors.success }}>
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
    leagueSection: {
        marginBottom: 25,
        borderRadius: 12,
        padding: 15,
    },
    userRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 1,
    },
});
