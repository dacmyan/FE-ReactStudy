import { useQuery } from "@tanstack/react-query";
import { ritualService } from "@/features/auth/service";
import type { RitualFilterParams } from "@/features/auth/types";

export const useRitualCatalog = (params?: RitualFilterParams) => {
  return useQuery({
    queryKey: ["ritualCatalog", params],
    queryFn: () => ritualService.getAll(params),
  });
};
