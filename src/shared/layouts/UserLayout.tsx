import { Outlet, NavLink } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { useLogoutMutation } from "@/features/auth/hooks/userAuth";
// import { ModeToggle } from "@/shared/components/ui/mode-toggle";
// import { useLogoutMutation } from "@/features/auth/hooks/useAuth";

export default function UserLayout() {
  const token = useAuthStore((state) => state.accessToken);

  const handleLogout = useLogoutMutation();

  const handleOut = () => {
    handleLogout.mutate();
  };
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-50">
        <nav className="max-w-4xl mx-auto flex justify-between items-center">
          <NavLink to="/" className="text-xl font-bold">
            ShopApp
          </NavLink>
          <div className="flex gap-4">
            {token && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 font-bold underline"
                    : "hover:text-blue-200"
                }
              >
                Profile
              </NavLink>
            )}
            {token && (
              <NavLink to="/" onClick={handleOut}>
                Logout
              </NavLink>
            )}

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-300 font-bold underline"
                  : "hover:text-blue-200"
              }
            >
              Home
            </NavLink>

            {!token && (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 font-bold underline"
                    : "hover:text-blue-200"
                }
              >
                Login
              </NavLink>
            )}
            {!token && (
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive
                    ? "text-yellow-300 font-bold underline"
                    : "hover:text-blue-200"
                }
              >
                Register
              </NavLink>
            )}
          </div>

          {/* <ModeToggle /> */}
        </nav>
      </header>

      {/* ===== MAIN CONTENT - Outlet (Thay đổi theo URL) ===== */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-6">
        <Outlet /> {/* 👈 LỖ HỔNG THẦN THÁNH: Nơi render các trang con */}
      </main>

      {/* ===== FOOTER - Nền nhà (Cố định) ===== */}
      <footer className="bg-gray-200 p-6 text-center text-sm text-gray-600">
        © 2024 ShopApp - Piedteam ReactJS Course
      </footer>
    </div>
  );
}
