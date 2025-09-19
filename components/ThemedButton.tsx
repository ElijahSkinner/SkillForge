// components/ThemedButton.tsx
import { Pressable, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type Props = {
    title: string;
    onPress: () => void;
};

export default function ThemedButton({ title, onPress }: Props) {
    const { theme } = useTheme();

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.base,
                {
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.lg
                },
            ]}
        >
            <Text style={{ color: theme.colors.text, fontWeight: "600", fontSize: 16 }}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        width: "90%",
        marginBottom: 15,
        alignItems: "center",
    },
});
