import { ritualService } from "@/features/auth/service";
import type { RitualFilterParams } from "@/features/auth/types";
import { useQuery } from "@tanstack/react-query";

export const useRitualList = (params?: RitualFilterParams) => {
    const query = useQuery({
        queryKey: ["rituals", params],
        queryFn: () => ritualService.getAll(params),
    });

    return {
        rituals: query.data?.data ?? [],
        pagination: query.data?.meta,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};