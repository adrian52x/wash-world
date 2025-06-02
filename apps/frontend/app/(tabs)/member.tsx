import { MembershipSelect } from '@/components/MembershipSelect';
import { useCancelMembership, useCreateMembership, useMemberships } from '@/hooks/useMemberships';
import { selectUserSession } from '@/redux/authSlice';
import { useAppSelector } from '@/redux/hooks';
import { MembershipTypeEnum } from '@/types/enums';
import { Membership } from '@/types/types';
import { getWashFeatures } from '@/utils';
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function MemberScreen() {
  const { memberships } = useMemberships();
  const { createMembership } = useCreateMembership();
  const { cancelMembership } = useCancelMembership();
  const [selectedType, setSelectedType] = useState<MembershipTypeEnum | null>(null);
  const userSession = useAppSelector(selectUserSession);
  const currentMembershipType = userSession?.userMembership?.membership.type;

  // check for disabling the btn
  const isCurrentMembership = Boolean(selectedType && selectedType.split(' - ')[0] === currentMembershipType);

  // map through memberships
  const membershipItems = memberships?.map((membership: Membership) => ({
    label: `${membership.type} - ${membership.price} DKK${membership.type === currentMembershipType ? ' - Current' : ''}`,
    extra: getWashFeatures(membership.type),
    id: membership.membershipId,
    isCurrent: membership.type === currentMembershipType,
  }));

  return (
    <View className="flex-1 p-4 pb-[100px]">
      {/* membership types */}
      <MembershipSelect
        items={membershipItems ?? []}
        selectedItem={selectedType?.toString() ?? null}
        onSelect={(label) => setSelectedType(label as MembershipTypeEnum)}
        subtitle="Select a membership type to get unlimited washes for a month:"
      />
      <View className="mt-20">
        {/* become a member btn */}
        <TouchableOpacity
          disabled={isCurrentMembership}
          className={`px-8 py-3 rounded-lg items-center ${isCurrentMembership ? 'bg-gray-400' : 'bg-green-light'}`}
          onPress={() => {
            if (selectedType) {
              const membershipType = selectedType.split(' - ')[0] as MembershipTypeEnum;
              const selectedMembership = memberships?.find((m: Membership) => m.type === membershipType);
              if (selectedMembership) {
                Alert.alert('Confirm Membership', `Are you sure you want to become a ${membershipType} member?`, [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Confirm',
                    onPress: () => createMembership.mutate(selectedMembership.membershipId),
                  },
                ]);
              }
            }
          }}
        >
          <Text className="text-white text-lg font-button">
            {`Become${selectedType ? ` ${selectedType.split(' - ')[0]}` : ''} member`}
          </Text>
        </TouchableOpacity>

        {/* cancel membership btn */}
        {currentMembershipType && (
          <TouchableOpacity
            className="px-8 py-3 rounded-lg items-center bg-transparent"
            onPress={() => {
              Alert.alert('Cancel Membership', 'Are you sure you want to cancel your membership?', [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes, Cancel',
                  style: 'destructive',
                  onPress: () => cancelMembership.mutate(),
                },
              ]);
            }}
          >
            <Text className=" text-red-500 text-lg font-button">Cancel membership</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
