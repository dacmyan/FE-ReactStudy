import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import type { RitualCategory } from "../type";
import type { PaginatedResponse } from "@/app/providers";

export const useRitualCategories = () => {
  return useQuery({
    queryKey: ["ritualCategories"],
    queryFn: async (): Promise<PaginatedResponse<RitualCategory>> => {
      const response = await apiClient.get<PaginatedResponse<RitualCategory>>("/ritual-category");
      return response as unknown as PaginatedResponse<RitualCategory>;
    },
  });
};
