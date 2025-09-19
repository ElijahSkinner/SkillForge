import { View, Text, ScrollView, StyleSheet } from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import { useTheme } from '@/context/ThemeContext';


// Forge-themed leagues (10 total) with individual colors
const LEAGUES = [
    { name: 'Copper League', minXP: 0, color: '#b87333' },
    { name: 'Bronze League', minXP: 100, color: '#cd7f32' },
    { name: 'Iron League', minXP: 300, color: '#a19d94' },
    { name: 'Steel League', minXP: 600, color: '#7b8a8b' },
    { name: 'Silver League', minXP: 900, color: '#c0c0c0' },
    { name: 'Gold League', minXP: 1200, color: '#ffd700' },
    { name: 'Platinum League', minXP: 1500, color: '#e5e4e2' },
    { name: 'Titanium League', minXP: 1800, color: '#878681' },
    { name: 'Adamantine League', minXP: 2200, color: '#6e6e70' },
    { name: 'Mithril League', minXP: 2600, color: '#a3d2ca' },
];

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
                    <View key={league.name} style={[styles.leagueSection, { backgroundColor: league.color + '33' }]}>
                        <Text style={[styles.leagueTitle, { color: league.color }]}>{league.name}</Text>
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
