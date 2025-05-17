import { ScrollView, View, Text } from 'react-native';

export default function MemberScreen() {
  return (
    <View className="flex-1">
      <ScrollView contentContainerClassName="p-4 space-y-2">
        <Text>Member Area</Text>
        <Text>This app includes example code to help you get started.</Text>
      </ScrollView>
    </View>
  );
}
