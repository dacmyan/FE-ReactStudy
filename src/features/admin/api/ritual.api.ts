import type { Ritual } from "@/features/ritual/type";
import apiClient from "@/lib/axios";
import type { PaginatedResponse } from "@/app/providers";

export const ritualApi = {
    getAllRitual: async (): Promise<Ritual[]> => {
        const response = await apiClient.get<PaginatedResponse<Ritual>>("/ritual");
        return (response as unknown as PaginatedResponse<Ritual>).data;
    }
}