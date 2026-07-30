import type { BaseFilterParams, PaginatedResponse } from "@/app/providers";
import type { Ritual } from "../ritual/type";

export type UserRole = "user" | "admin";

export interface AuthState {
  accessToken: string | null;
  role: UserRole | null;
}

export interface AuthActions {
  setAuth: (access: string, role: UserRole | null) => void;
  clearAuth: () => void;
}


//
export interface AuthResponse {
  accessToken: string;
  subscriptio?: {
    hasActiveSubscription: boolean;
    subscriptionType?: string;
  }
}

export interface JwtPayLoad {
  role?: UserRole;
  email?: string;
  fullName?: string;
}

export interface CreateRitualDto {
  name: string;
  dateLunar: string;
  dateSolar?: string;
  timeOfExecution?: string;
  difficultyLevel: string;
  description?: string;
  reference?: string;
  isHot?: boolean;
  ritualCategoryId?: string;
}

export type UpdateRitualDto = Partial<CreateRitualDto>;

export type RitualSelectOption = Selection;

export interface RitualFilterParams extends BaseFilterParams {
  difficultLevel?: string;
  isHot?: boolean;
  ritualCategoryId?: string;
}

export type RitualListResponse = PaginatedResponse<Ritual>;