import { authApi } from "@/features/auth/service";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/features/auth/store";
import { jwtDecode } from "jwt-decode";
import { useMutation } from "@tanstack/react-query";
import type { AuthResponse, JwtPayLoad } from "../types";
import type { LoginSchemaType } from "../schema";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useLoginMutation = () => {

  const location = useLocation();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, Error, LoginSchemaType>({

    mutationFn: (
      useData: {
        email: string;
        password: string;
      }
    ) => authApi.login(useData),

    onSuccess: (response) => {
      const decoded = jwtDecode<JwtPayLoad>(response.accessToken);
      setAuth(response.accessToken, decoded.role ?? null);

      toast.success("Đăng nhập thành công");

      if (decoded.role == "admin") {
        navigate("/admin/rituals", { replace: true });
      } else {
        navigate(location, { replace: true })
      }
    },

    onSettled: () => {
      // Có thể dùng để reset form hoặc thực hiện các hành động khác sau khi mutation hoàn thành (thành công hoặc thất bại)
    }

  })

}

export const useRegisterMutation = () => {
  const navigate = useNavigate();

  return useMutation({

    mutationFn: (userData: {
      fullName: string;
      email: string;
      password: string;
    }) => authApi.register(userData),

    onSuccess: () => {
      toast.success("Đăng ký thành công", {
        description: "Bạn đã có thể đăng nhập ngay bây giờ",
      });

      navigate("/login");
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    },

    onSettled: () => {
      // Có thể dùng để reset form hoặc thực hiện các hành động khác sau khi mutation hoàn thành (thành công hoặc thất bại)
    }
  })
}

export const useLogoutMutation = () => {

  const clearAuth = useAuthStore().clearAuth

  return useMutation({

    mutationFn: () => authApi.logOut(),

    onSuccess: () => {
      clearAuth();

      //xóa cái cache của user đi, để khi vào lại trang profile sẽ bị redirect về login
      queryClient.removeQueries();

      // làm cái data cũ
      // queryClient.invalidateQueries();

      //xóa cụ thể 1 cái key
      // xài cho mấy cái CRUD
      // queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Đăng xuất thành công");
    },

    onError: () => {
      clearAuth();
      queryClient.removeQueries();
      // queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Đăng xuất thành công");
    }
  })
}