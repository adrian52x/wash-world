import { SelectionList } from '@/components/SelectionList';
import { useCreateMembership, useMemberships } from '@/hooks/useMemberships';
import { MembershipTypeEnum } from '@/types/enums';
import { Membership } from '@/types/types';
import { getWashFeatures } from '@/utils';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function MemberScreen() {
  const { memberships } = useMemberships();
  const { createMembership } = useCreateMembership();
  const [selectedType, setSelectedType] = useState<MembershipTypeEnum | null>(
    null,
  );

  const membershipItems = memberships?.map((membership: Membership) => ({
    label: `${membership.type} - ${membership.price} DKK`,
    extra: getWashFeatures(membership.type),
    id: membership.membershipId,
  }));

  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">
        <SelectionList
          items={membershipItems ?? []}
          selectedItem={selectedType?.toString() ?? null}
          onSelect={(label) => setSelectedType(label as MembershipTypeEnum)}
          onContinue={() => {
            if (selectedType) {
              // extract just the membership type from the selected label
              const membershipType = selectedType.split(
                ' - ',
              )[0] as MembershipTypeEnum;
              const selectedMembership = memberships?.find(
                (m: Membership) => m.type === membershipType,
              );
              if (selectedMembership) {
                createMembership.mutate(selectedMembership.membershipId);
              }
            }
          }}
          title="Become a member!"
          subtitle="Select a membership type to get unlimited washes for a month:"
        />
      </ScrollView>
    </View>
  );
}
