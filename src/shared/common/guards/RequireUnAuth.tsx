import { useAuthStore } from "@/features/auth/store";
import { Navigate, Outlet } from "react-router-dom";

export default function RequireUnauth() {
  const isAuthed = useAuthStore((state) => !!state.accessToken);

  if (isAuthed) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
