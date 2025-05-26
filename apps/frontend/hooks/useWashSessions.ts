import { WashesAPI } from '@/api/WashesAPI';
import { InsertWash } from '@/types/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Fetch wash types
export const useWashTypes = () => {
  const {
    data: washTypes,
    isLoading: loadingWashTypes,
    isError: errorWashTypes,
  } = useQuery({
    queryKey: ['washTypes'],
    queryFn: () => WashesAPI.getWashTypes(),
  });

  return {
    washTypes,
    loadingWashTypes,
    errorWashTypes,
  };
};

// Fetch user wash sessions
export const useWashSessions = () => {
  const {
    data: washSessions,
    isLoading: loadingWashSessions,
    isError: errorWashSessions,
  } = useQuery({
    queryKey: ['userWashSessions'],
    queryFn: () => WashesAPI.getUserWashSessions(),
    retry: 1, // Retry once on failure
  });

  return { washSessions, loadingWashSessions, errorWashSessions };
};

// Create wash session
export const useCreateWashSession = () => {
  const queryClient = useQueryClient();

  const createWashSession = useMutation({
    mutationFn: (washSession: InsertWash) =>
      WashesAPI.createWashSession(washSession),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWashSessions'] });
    },
  });

  return {
    createWashSession,
  };
};
