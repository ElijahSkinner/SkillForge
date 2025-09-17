// app/index.tsx
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext"; // wherever you store auth

export default function Index() {
    const { user } = useAuth(); // `user` = logged-in user object or null

    if (!user) {
        // not logged in → show login page
        return <Redirect href="/(auth)/home" />;
    }

    // logged in → go straight to roadmap tab
    return <Redirect href="/(tabs)/roadmap" />;
}
