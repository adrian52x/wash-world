import { APIError } from '@/api/errorAPI';
import { UsersAPI } from '@/api/UsersAPI';
import { UpdateUser, WashStats } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
};

export const useUserWashStats = () => {
  const {
    data: washStats,
    isLoading: loadingWashStats,
    error: errorWashStats,
    refetch: refetchWashStats,
  } = useQuery<WashStats, APIError>({
    queryKey: ['userStatistics'],
    queryFn: () => UsersAPI.getUserStatistics(),
    retry: 2,
  });

  return {
    washStats,
    loadingWashStats,
    errorWashStats,
    refetchWashStats,
  };
};
