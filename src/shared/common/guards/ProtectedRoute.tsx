import { useAuthStore } from "@/features/auth/store";
import type { UserRole } from "@/features/auth/types";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export function ProtectedRoute({
    children,
    allowedRoles,
}: ProtectedRouteProps) {
    const location = useLocation();
    const { accessToken, role } = useAuthStore();

    if (!accessToken) {
        return <Navigate to={"/login"} state={{ from: location }} replace />
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        return <Navigate to={"/unauthorized"} replace />
    }

    return <>{children}</>
}