import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/shared/pages/HomePage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import UserLayout from "@/shared/layouts/UserLayout";
import { GuestRoute } from "@/shared/common/guards/GuestRoute";
import RitualDetail from "@/features/ritual/pages/RitualDetail";
import { ProtectedRoute } from "@/shared/common/guards/ProtectedRoute";
import Unauthorized from "@/shared/pages/Unauthorized";
import ProfilePage from "@/features/auth/pages/ProfilePage";
import NotFoundPage from "@/shared/pages/NotFoundPage";
import AdminLayout from "@/shared/layouts/AdminLayout";
import DashBoardPage from "@/shared/pages/DashBoardPage";
import ManageRitualList from "@/features/ritual/pages/ManageRitualList";
import ManageRitualCreate from "@/features/ritual/pages/ManageRitualCreate";
import ManageRitualEdit from "@/features/ritual/pages/ManageRitualEdit";
import UserManagementPage from "@/features/admin/pages/UserManagementPage";
import RitualCatalogPage from "@/features/ritual/pages/RitualCatalogPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />, // Layout bọc ngoài (Cái nhà)
    children: [
      { index: true, element: <HomePage /> },
      { path: "ritual/:id", element: <RitualDetail /> },

      {
        path: "login",
        element: (
          <GuestRoute>
            <LoginPage />
          </GuestRoute>
        )
      },
      {
        path: "register",
        element: (
          <GuestRoute>
            <RegisterPage />
          </GuestRoute>
        )
      }, {
        path: "unauthorized", element: (<Unauthorized />)
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: "*", element: <NotFoundPage />
      },
      { path: "rituals", element: <RitualCatalogPage /> },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            {(<AdminLayout />)}
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashBoardPage /> },
          { path: "rituals", element: <ManageRitualList /> },
          { path: "rituals/create", element: <ManageRitualCreate /> },
          { path: "rituals/:id/edit", element: <ManageRitualEdit /> },
          { path: "users", element: <UserManagementPage /> },

        ]
      }
    ]
  },
]);
