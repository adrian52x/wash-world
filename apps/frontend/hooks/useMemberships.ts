import { MembershipsAPI } from '@/api/MembershipsAPI';
import { fetchUserSession } from '@/redux/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useMemberships = () => {
  // Fetch memberships
  const {
    data: memberships,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['memberships'],
    queryFn: () => MembershipsAPI.getMemberships(),
    retry: 2,
  });

  return {
    memberships,
    isLoading,
    error,
  };
};

export const useCreateMembership = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch(); // Add this

  const createMembership = useMutation({
    mutationFn: (membershipId: number) => MembershipsAPI.createMembership(membershipId),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      dispatch(fetchUserSession({}));
    },
  });

  return { createMembership };
};
