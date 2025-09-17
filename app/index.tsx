// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
    const { user } = useAuth(); // `user` = logged-in user object or null

    if (!user) {
        return <Redirect href="/(auth)/home" />;
    }

    return <Redirect href="/(tabs)/roadmap" />;
}
