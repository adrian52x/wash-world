import { View, Text, TouchableOpacity } from 'react-native';
import {
  Circle,
  CircleCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

type SelectionItem = {
  label: string;
  extra: string[];
};

type SelectionListProps = {
  items: SelectionItem[];
  selectedItem: string | null;
  onSelect: (label: string) => void;
  onContinue: () => void;
  title: string;
  subtitle?: string;
};

export function SelectionList({
  items,
  selectedItem,
  onSelect,
  onContinue,
  title,
  subtitle,
}: SelectionListProps) {
  return (
    <View className="flex-1 p-2">
      <Text className="font-header text-header font-bold mb-4">{title}</Text>
      {subtitle && (
        <Text className="font-subheader text-accent-gray-60 mb-4">
          {subtitle}
        </Text>
      )}

      <View className="flex-col flex-1">
        {items.map((item) => {
          const isSelected = selectedItem === item.label;
          const CheckIcon = isSelected ? CircleCheck : Circle;
          const Chevron = isSelected ? ChevronUp : ChevronDown;

          return (
            <TouchableOpacity
              key={item.label}
              className={`flex-col px-4 py-3 border border-gray-300 ${
                isSelected ? 'bg-green-light' : 'bg-white'
              }`}
              onPress={() => onSelect(item.label)}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <CheckIcon size={20} />
                  <Text
                    className={`text-lg font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Text>
                </View>
                <Chevron size={20} />
              </View>
              {isSelected && (
                <View className="mt-2">
                  {item.extra.map((extraItem, idx) => (
                    <Text
                      key={idx}
                      className="font-bodyText text-bodyText text-white"
                    >
                      • {extraItem}
                    </Text>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        className="bg-green-light px-8 py-3 rounded-lg mb-10 items-center"
        onPress={onContinue}
      >
        <Text className="text-white text-lg font-button">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
