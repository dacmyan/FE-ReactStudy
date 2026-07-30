//xử lý dịch vụ liên quan tới auth
//login, register, logout, get...

import { apiClient } from "@/lib/axios";
import type { AuthResponse, CreateRitualDto, RitualFilterParams, UpdateRitualDto } from "./types";
import { createBaseService } from "@/shared/services/BaseServices";
import type { Ritual } from "../ritual/type";


interface LoginSchemaType {
  email: string;
  password: string;
}

interface RegisterSchemaType {
  fullName: string;
  email: string;
  password: string;
}

interface UserInfo {
  _id: string;
  fullName: string;
  email: string;
}
export const authApi = {

  //login
  async login(credentials: LoginSchemaType): Promise<AuthResponse> {
    //gọi api
    return apiClient.post(
      "/auth/login",
      credentials,
    ) as unknown as Promise<AuthResponse>;
  },

  //register
  async register(credentials: RegisterSchemaType): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      "/auth/register",
      credentials,
    ) as unknown as Promise<AuthResponse>;
  },

  //logout
  async logOut(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  //get user info
  async getUserInfo(): Promise<UserInfo> {
    const { data } = await apiClient.get("/auth/me");
    return {
      _id: data.id,
      email: data.email,
      fullName: data.fullName,
    }
  }
}

export const ritualService = createBaseService<
  Ritual,
  CreateRitualDto,
  UpdateRitualDto,
  RitualFilterParams
>({
  endpoint: "/ritual",
})