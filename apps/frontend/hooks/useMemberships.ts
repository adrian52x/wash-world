import { MembershipsAPI } from '@/api/MembershipsAPI';
import { fetchUserSession } from '@/redux/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Fetch memberships
export const useMemberships = () => {
  const {
    data: memberships,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['memberships'],
    queryFn: () => MembershipsAPI.getMemberships(),
    retry: 2,
  });

  return { memberships, isLoading, error };
};

// Create user membership
export const useCreateMembership = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const createMembership = useMutation({
    mutationFn: (membershipId: number) => MembershipsAPI.createMembership(membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      dispatch(fetchUserSession({}));
    },
  });

  return { createMembership };
};

// Cancel user membership
export const useCancelMembership = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const cancelMembership = useMutation({
    mutationFn: () => MembershipsAPI.cancelMembership(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships'] });
      dispatch(fetchUserSession({}));
    },
  });

  return { cancelMembership };
};
