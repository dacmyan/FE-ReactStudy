import { useQuery } from "@tanstack/react-query";
import { authApi } from "../service";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authApi.getUserInfo,
    staleTime: 1000 * 60 * 1,
  })


}