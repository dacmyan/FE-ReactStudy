import { useQuery } from "@tanstack/react-query";
import { ritualService } from "@/features/auth/service";

export const useRitualDetail = (id: string | undefined) => {
  return useQuery({
    queryKey: ["ritual", id],
    queryFn: () => {
      if (!id) throw new Error("Ritual ID is required");
      return ritualService.getById(id);
    },
    enabled: !!id,
  });
};
