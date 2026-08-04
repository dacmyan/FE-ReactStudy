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
import RitualCatalogPage from "@/features/ritual/pages/RitualCatalogPage";
import { lazy, Suspense, type ReactNode } from "react";

const AdminLayout = lazy(() => import("@/shared/layouts/AdminLayout"));
// const DashboardPage = lazy(() => import("@/shared/pages/DashBoardPage"));
const ManageRitualList = lazy(() => import("@/features/ritual/pages/ManageRitualList"));
const ManageRitualCreate = lazy(() => import("@/features/ritual/pages/ManageRitualCreate"));
const ManageRitualEdit = lazy(() => import("@/features/ritual/pages/ManageRitualEdit"));
const UserManagementPage = lazy(() => import("@/features/admin/pages/UserManagementPage"));

const withSupense = (children: ReactNode) => (
  <Suspense fallback={<p>loading...</p>}>
    {children}
  </Suspense>
)

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
            {withSupense((<AdminLayout />))}
          </ProtectedRoute>
        ),
        children: [
          { path: "rituals", element: withSupense(<ManageRitualList />) },
          { path: "rituals/create", element: withSupense(<ManageRitualCreate />) },
          { path: "rituals/:id/edit", element: withSupense(<ManageRitualEdit />) },
          { path: "users", element: withSupense(<UserManagementPage />) },

        ]
      }
    ]
  },
]);
