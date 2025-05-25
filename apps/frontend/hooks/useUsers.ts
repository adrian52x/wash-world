import { UsersAPI } from "@/api/UsersAPI";
import { UpdateUser } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const updateUser = useMutation({
    mutationFn: (userData: UpdateUser) => UsersAPI.updateUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return {
    updateUser,
  };
}