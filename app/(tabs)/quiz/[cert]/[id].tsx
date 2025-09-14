import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function QuizScreen() {
    const { cert, id } = useLocalSearchParams<{ cert: string; id: string }>();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quiz for {cert}</Text>
            <Text style={styles.subtitle}>Module ID: {id}</Text>
            {/* You’ll put your actual quiz questions here */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
    subtitle: { fontSize: 18, color: "gray" },
});
