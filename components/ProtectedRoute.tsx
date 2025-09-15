// components/ProtectedRoute.tsx
import { useAuth } from "../context/AuthContext";
import { Redirect } from "expo-router";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="/(auth)/login" />;
    }

    return <>{children}</>;
}
