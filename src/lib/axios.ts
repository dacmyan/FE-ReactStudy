// tạo ra apiCLient để gọi API
//interceptor(request, response)
//request: tự thêm token vào header
//response: tự động bắt lỗi và request token flow

import axios from "axios";
import { env } from "./env";
import { useAuthStore } from "@/features/auth/store";
import { toast } from "sonner";

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
)

// Hàng đợi 
/**
 * Xử lý hàng đợi requests khi đang chờ refresh token
 * @param error - Lỗi nếu refresh token thất bại
 * @param token - Token mớii nếu refresh success
 */

let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];
let isRefreshing = false;

// Hàm xử lý hàng đợi sau khi refresh token thành công hoặc thất bại
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (token) p.resolve(token);
    else p.reject(error);
  });
  failedQueue = [];
}


// Interceptor luồng xử lys
// thấy 401
// ko phải là các endpoint của Auth (login, register, refresh)


apiClient.interceptors.response.use(
  (response) => {
    return response.data?.data !== undefined ? response.data.data : response.data;
  },

  async (error) => {
    const originalRequest = error.config;
    const notAuthReqs = !originalRequest.url?.includes("/auth/login");
    const is401 = error.response?.status === 401;
    const notRetriedYet = !originalRequest._retry;

    // lấy API A bị lỗi 401, thì gọi API B để refresh token, rồi gọi lại API A

    // lấy status code từ response của AP

    if (is401 && notAuthReqs && notRetriedYet) {
      originalRequest._retry = true; // đánh dấu đã retry để tránh vòng lặp vô hạn

      // Case 1: Đang refresh token rồi mà vẫn có request khác bị 401, thì đẩy request đó vào hàng đợi, chờ refresh token xong sẽ tự động gọi lại
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      // Case 2: Chưa có request nào refresh token, thì bắt đầu quy trình refresh token
      isRefreshing = true;
      originalRequest._retry = true;

      try {
        // 2 dòng này chỉ xử lý khi nó ở local
        const reposnse = await axios.post(
          `${import.meta.env.VITE_API_URL}auth/refresh`,
          {}, // Empty body vì refesh token ở cookies
          {
            withCredentials: true,
          }
        );

        //Api chỉ trả về accessToken mới, nên phải lấy refreshToken từ state cũ
        const newToken: string =
          reposnse.data?.data?.accessToken ?? reposnse.data?.accessToken;

        // Cập nhật accessToken mới vào store
        useAuthStore.getState().setAuth(
          newToken,
          useAuthStore.getState().role,
        );

        processQueue(null, newToken);

        // Cập nhật header Authorization của request gốc với accessToken mới
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Gọi lại API gốc với accessToken mới
        return apiClient(originalRequest);

      } catch (refreshError) {

        // Lí do
        // Hết hạn
        // revoked( logout ở 1 nơi khác)
        //server lỗi
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        // muốn app hoàn toàn đc reset về trạng thái chưa login, thì phải reload lại trang
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login"; // Chuyển hướng về trang login nếu refresh token cũng bị lỗi (ví dụ: hết hạn)
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    const message = error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại.";

    const isLogoutEndpoint = originalRequest.url?.includes("/auth/logout");

    if (!isLogoutEndpoint) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
)

export default apiClient;