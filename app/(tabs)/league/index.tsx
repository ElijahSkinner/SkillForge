import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { useTheme } from '@/context/ThemeContext';


const LEAGUE_ORDER = [
    'copper', 'bronze', 'iron', 'steel',
    'silver', 'gold', 'platinum', 'titanium',
    'adamantine', 'mithril'
];

const LEAGUES = LEAGUE_ORDER.map((key, index) => ({
    name: `${key.charAt(0).toUpperCase() + key.slice(1)} League`,
    color: theme.colors.leagues[key],
    minXP: index * 300,
}));

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
    
    return (
<SafeAreaView style={{ flex: 1}}>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
            <Text style={styles.header}>Forge Leagues</Text>

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
                            { backgroundColor: league.color + '33' }
                        ]}
                    >
                        <Text style={[styles.leagueTitle, { color: league.color }]}>
                            {league.name}
                        </Text>
                        {usersInLeague.length === 0 ? (
                            <Text style={styles.noUsers}>No users in this league yet</Text>
                        ) : (
                            usersInLeague
                                .sort((a, b) => b.xp - a.xp)
                                .map((user, i) => (
                                    <View key={user.name} style={styles.userRow}>
                                        <Text style={styles.rank}>{i + 1}</Text>
                                        <Text style={styles.username}>{user.name}</Text>
                                        <Text style={styles.xp}>{user.xp} XP</Text>
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
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        textAlign: 'center',
    },
    leagueSection: {
        marginBottom: 25,
        borderRadius: 12,
        padding: 15,
    },
    leagueTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 10,
    },
    noUsers: {
        color: '#aaa',
        fontStyle: 'italic',
    },
    userRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomColor: '#333',
        borderBottomWidth: 1,
    },
    rank: {
        color: '#fff',
        fontWeight: '600',
        width: 30,
    },
    username: {
        color: '#fff',
        flex: 1,
    },
    xp: {
        color: '#7ed321',
        fontWeight: '600',
    },
});
