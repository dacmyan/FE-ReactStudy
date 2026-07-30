import { ritualService } from "@/features/auth/service";
import type { RitualFilterParams } from "@/features/auth/types";
import { useQuery } from "@tanstack/react-query";

export const useRitualList = (params?: RitualFilterParams) => {
    const apiParams = params ? { ...params } : undefined;
    if (apiParams && apiParams.isHot === false) {
        delete apiParams.isHot;
    }

    const query = useQuery({
        queryKey: ["rituals", params],
        queryFn: () => ritualService.getAll(apiParams),
    });

    const rawRituals = query.data?.data ?? [];
    const rituals = params?.isHot === false
        ? rawRituals.filter((r) => !r.isHot)
        : rawRituals;

    return {
        rituals,
        pagination: query.data?.meta,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    };
};