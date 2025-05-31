import MemberScreen from '@/app/(tabs)/member';
import { useCancelMembership, useCreateMembership, useMemberships } from '@/hooks/useMemberships';
import { useAppSelector } from '@/redux/hooks';
import { fireEvent, render } from '@testing-library/react-native';
import { Alert } from 'react-native';

jest.mock('@/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

jest.mock('@/redux/authSlice', () => ({
  fetchUserSession: jest.fn(),
  selectUserSession: jest.fn(),
}));

jest.mock('@/hooks/useMemberships', () => ({
  useMemberships: jest.fn(),
  useCreateMembership: jest.fn(),
  useCancelMembership: jest.fn(),
}));

jest.spyOn(Alert, 'alert');

describe('MemberScreen', () => {
  const createMembershipMock = jest.fn();
  const cancelMembershipMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useMemberships as jest.Mock).mockReturnValue({
      memberships: [
        { type: 'GOLD', price: 139, membershipId: 1 },
        { type: 'PREMIUM', price: 169, membershipId: 2 },
      ],
    });

    (useCreateMembership as jest.Mock).mockReturnValue({
      createMembership: { mutate: createMembershipMock },
    });

    (useCancelMembership as jest.Mock).mockReturnValue({
      cancelMembership: { mutate: cancelMembershipMock },
    });

    (useAppSelector as jest.Mock).mockReturnValue({
      userMembership: {
        membership: {
          type: 'GOLD',
        },
      },
    });
  });

  it('renders MembershipSelect with correct data', () => {
    const { getByText } = render(<MemberScreen />);

    expect(getByText('Select a membership type to get unlimited washes for a month:')).toBeTruthy();
    expect(getByText('GOLD - 139 DKK - Current')).toBeTruthy();
    expect(getByText('PREMIUM - 169 DKK')).toBeTruthy();
  });

  it('creates a new membership when btn is pressed and confirmed', () => {
    const { getByText } = render(<MemberScreen />);

    const membershipOption = getByText('PREMIUM - 169 DKK');
    fireEvent.press(membershipOption);

    const memberButton = getByText('Become PREMIUM member');
    fireEvent.press(memberButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Confirm Membership',
      'Are you sure you want to become a PREMIUM member?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'Cancel' }),
        expect.objectContaining({ text: 'Confirm' }),
      ]),
    );

    const confirmAction = (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress;
    confirmAction();

    expect(createMembershipMock).toHaveBeenCalledWith(2);
  });

  it('disables button when selecting current membership type', () => {
    const { getByText } = render(<MemberScreen />);

    const currentMembership = getByText('GOLD - 139 DKK - Current');
    fireEvent.press(currentMembership);

    const memberButton = getByText('Become GOLD member');
    expect(memberButton.parent?.parent?.props.accessibilityState.disabled).toBe(true);
  });

  it('deletes the membership when cancel btn is clicked', () => {
    const { getByText } = render(<MemberScreen />);

    const cancelButton = getByText('Cancel membership');
    fireEvent.press(cancelButton);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Cancel Membership',
      'Are you sure you want to cancel your membership?',
      expect.arrayContaining([
        expect.objectContaining({ text: 'No' }),
        expect.objectContaining({ text: 'Yes, Cancel' }),
      ]),
    );

    const confirmCancel = (Alert.alert as jest.Mock).mock.calls[0][2][1].onPress;
    confirmCancel();

    expect(cancelMembershipMock).toHaveBeenCalled();
  });
});
