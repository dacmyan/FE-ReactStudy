import { useQuery } from "@tanstack/react-query";
import { ritualService } from "@/features/auth/service";
import type { RitualFilterParams } from "@/features/auth/types";

export const useRitualCatalog = (params?: RitualFilterParams) => {
  const apiParams = params ? { ...params } : undefined;
  if (apiParams && apiParams.isHot === false) {
    delete apiParams.isHot;
  }

  const query = useQuery({
    queryKey: ["ritualCatalog", params],
    queryFn: () => ritualService.getAll(apiParams),
  });

  const rawRituals = query.data?.data ?? [];
  const rituals = params?.isHot === false
    ? rawRituals.filter((r) => !r.isHot)
    : rawRituals;

  return {
    ...query,
    rituals,
    pagination: query.data?.meta,
  };
};
