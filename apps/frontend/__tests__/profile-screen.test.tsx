import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert, View } from 'react-native';
import { RoleEnum } from '@/types/enums';
import ProfileScreen from '../app/(tabs)/profile';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useUpdateUser, useUserWashStats } from '@/hooks/useUsers';
import { useWashSessions } from '@/hooks/useWashSessions';
import { UpdateUserForm } from '@/components/UpdateUserForm';
import { UserDetailsCard } from '@/components/UserDetailsCard';
import { WashSessionsCard } from '@/components/WashSessionsCard';
import { ExtraFeaturesCard } from '@/components/ExtraFeaturesCard';
import { User } from '@/types/auth.types';

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/hooks/useUsers', () => ({
  useUpdateUser: jest.fn(),
  useUserWashStats: jest.fn(),
}));

jest.mock('@/hooks/useWashSessions', () => ({
  useWashSessions: jest.fn(),
}));

jest.mock('@/redux/authSlice', () => ({
  fetchUserSession: jest.fn(),
  logout: jest.fn(),
  selectUserSession: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
  }),
}));

jest.mock('@/components/ui/LoadingSpinner', () => 'LoadingSpinner');

jest.mock('@/components/UpdateUserForm', () => ({
  UpdateUserForm: jest.fn().mockImplementation(() => null),
}));

jest.mock('@/components/UserDetailsCard', () => ({
  UserDetailsCard: jest.fn().mockImplementation(() => null),
}));

jest.mock('@/components/WashSessionsCard', () => ({
  WashSessionsCard: jest.fn().mockImplementation(() => null),
}));

jest.mock('@/components/ExtraFeaturesCard', () => ({
  ExtraFeaturesCard: jest.fn().mockImplementation(() => null),
}));

jest.spyOn(Alert, 'alert');

describe('ProfileScreen', () => {
  const dispatchMock = jest.fn();
  const mutateMock = jest.fn().mockResolvedValue({});
  const refetchStatsMock = jest.fn();
  const refetchSessionsMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (UpdateUserForm as jest.Mock).mockImplementation(() => <View testID="update-user-form">UpdateUserForm</View>);

    (UserDetailsCard as jest.Mock).mockImplementation(() => <View testID="user-details-card">UserDetailsCard</View>);

    (WashSessionsCard as jest.Mock).mockImplementation(() => <View testID="wash-sessions-card">WashSessionsCard</View>);

    (ExtraFeaturesCard as jest.Mock).mockImplementation(() => (
      <View testID="extra-features-card">ExtraFeaturesCard</View>
    ));

    (useAppDispatch as jest.Mock).mockReturnValue(dispatchMock);
    (useUpdateUser as jest.Mock).mockReturnValue({
      updateUser: { mutateAsync: mutateMock, isPending: false },
    });
    (useUserWashStats as jest.Mock).mockReturnValue({
      washStats: { totalWashes: 5, favoriteProgram: 'Basic' },
      loadingWashStats: false,
      errorWashStats: null,
      refetchWashStats: refetchStatsMock,
    });
    (useWashSessions as jest.Mock).mockReturnValue({
      washSessions: [{ id: 1, date: '2023-01-01' }],
      loadingWashSessions: false,
      errorWashSessions: null,
      refetchWashSessions: refetchSessionsMock,
    });
  });

  const setUserSession = (user: Partial<User>) => {
    (useAppSelector as jest.Mock).mockReturnValue({ user });
  };

  it('shows onboarding form if user details are incomplete', () => {
    setUserSession({ phoneNumber: null, address: null, licensePlate: null, role: RoleEnum.User });
    const { queryByTestId } = render(<ProfileScreen />);
    expect(queryByTestId('update-user-form')).toBeTruthy();
  });

  it('shows user details and wash sessions when onboarding is complete', () => {
    setUserSession({ phoneNumber: '123', address: 'Main St', licensePlate: 'XYZ', role: RoleEnum.User });
    const { queryByTestId } = render(<ProfileScreen />);
    expect(queryByTestId('user-details-card')).toBeTruthy();
    expect(queryByTestId('wash-sessions-card')).toBeTruthy();
  });

  it('shows upgrade option for regular users', () => {
    setUserSession({ phoneNumber: '123', address: 'Main St', licensePlate: 'XYZ', role: RoleEnum.User });
    const { getByText } = render(<ProfileScreen />);
    expect(getByText('Upgrade to Paid User')).toBeTruthy();
  });

  it('shows extra features for paid users', () => {
    setUserSession({ phoneNumber: '123', address: 'Main St', licensePlate: 'XYZ', role: RoleEnum.PaidUser });
    const { queryByTestId } = render(<ProfileScreen />);
    expect(queryByTestId('extra-features-card')).toBeTruthy();
  });

  it('triggers upgrade confirmation and updates role', async () => {
    setUserSession({ phoneNumber: '123', address: 'Main St', licensePlate: 'XYZ', role: RoleEnum.User });
    const { getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Upgrade to Paid User'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Confirm Upgrade',
      'Are you sure you want to upgrade to Paid USER?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Upgrade' }),
      ]),
    );

    const onPress = (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress;
    onPress();
    expect(mutateMock).toHaveBeenCalledWith(
      { role: RoleEnum.PaidUser },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });
});
