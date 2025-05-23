import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import step1 from '@/assets/images/wash-step1.png';
import step2 from '@/assets/images/wash-step2.png';
import step3 from '@/assets/images/wash-step3.png';
import CarImage from '@/assets/images/washed-car.png';
import {
  ChevronDown,
  ChevronUp,
  Circle,
  CircleCheck,
} from 'lucide-react-native';

const washTypes = [
  {
    label: 'Gold - 59 DKK',
    extra: [
      'Shampoo',
      'Drying',
      'Brush washing',
      'High-pressure flushing',
      'Wheel wash',
      'Rinsing wax',
    ],
  },
  {
    label: 'Premium - 89 DKK',
    extra: [
      'Shampoo',
      'Drying',
      'Brush washing',
      'High-pressure flushing',
      'Wheel wash',
      'Rinsing wax',
      'Insect repellent',
      'Degreasing',
      'Foam splash',
    ],
  },
  {
    label: 'Brilliant - 119 DKK',
    extra: [
      'Shampoo',
      'Drying',
      'Brush washing',
      'High-pressure flushing',
      'Wheel wash',
      'Rinsing wax',
      'Insect repellent',
      'Degreasing',
      'Foam splash',
      'Massage',
      'Playing orchestra',
    ],
  },
];

const processSteps = [
  { label: 'Enter the hall', image: null },
  { label: 'Shampoo 1', image: step1 },
  { label: 'Shampoo 2 special', image: step2 },
  { label: 'Drying', image: step3 },
];

export default function WashProcessScreen() {
  const { id } = useLocalSearchParams();
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState(washTypes[1].label);
  const router = useRouter();

  useEffect(() => {
    // Preload all step images on mount
    [step1, step2, step3].forEach((img) => {
      Image.prefetch(Image.resolveAssetSource(img).uri);
    });
  }, []);

  // Step 0: Select wash type
  if (step === 0) {
    return (
      <>
        <Stack.Screen
          options={{
            headerTitle: '',
            headerBackTitle: 'Back',
          }}
        />
        <View className="flex-1 p-6">
          <Text className="font-header text-header font-bold mb-4">
            Choose a wash
          </Text>
          <Text className="font-subheader text-accent-gray-60 mb-4">
            Your license plate was scanned at Hall 2, please choose a wash
            program you'd like to proceed with:
          </Text>

          <View className="flex-col flex-1">
            {washTypes.map((type) => {
              const isSelected = selectedType === type.label;
              const CheckIcon = isSelected ? CircleCheck : Circle;
              const Chevron = isSelected ? ChevronUp : ChevronDown;
              return (
                <TouchableOpacity
                  key={type.label}
                  className={`flex-col px-4 py-3 border border-gray-300 ${
                    isSelected ? 'bg-green-light' : 'bg-white'
                  }`}
                  onPress={() => setSelectedType(type.label)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <CheckIcon size={20} />
                      <Text
                        className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}
                      >
                        {type.label}
                      </Text>
                    </View>
                    <Chevron size={20} />
                  </View>
                  {isSelected && (
                    <View className="mt-2">
                      {type.extra.map((item, idx) => (
                        <Text
                          key={idx}
                          className="font-bodyText text-bodyText text-white"
                        >
                          • {item}
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
            onPress={() => setStep(1)}
          >
            <Text className="text-white text-lg font-button">Continue</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // Steps 1+: Process steps
  const processIndex = step - 1;
  if (processIndex < processSteps.length) {
    const current = processSteps[processIndex];
    return (
      <View className="flex-1 pt-[100px] items-center bg-white">
        <Text className="font-button text-bodyText text-green-light">
          Step {step}
        </Text>
        <Text className="mb-4 font-subheader text-subheader">
          {current.label}
        </Text>
        {step === 1 && (
          <Text className="font-bodyText text-bodyText text-center max-w-xs">
            The washing will begin once you're inside the hall
          </Text>
        )}
        {current.image && (
          <Image
            source={current.image}
            className="w-48 h-48 mb-6"
            resizeMode="contain"
          />
        )}
        <TouchableOpacity
          className="bg-green-light px-8 py-3 mt-10"
          onPress={() => setStep(step + 1)}
        >
          <Text className="text-white font-button text-button">
            {processIndex === processSteps.length - 1 ? 'Finish' : 'Next step'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // All done
  return (
    <View className="flex-1 pt-[200px] items-center bg-green-light">
      <Text className="text-header font-header text-white mb-4">
        You are good to go!
      </Text>
      <Text className="text-bodyText font-subheader text-white">
        +10 WashPoints added
      </Text>
      <Image
        source={CarImage}
        className="w-48 h-48 mb-2"
        resizeMode="contain"
      />
      <TouchableOpacity
        className="bg-accent-gray-80 px-8 py-3"
        onPress={() => router.push(`/(tabs)`)}
      >
        <Text className="text-white font-button text-button">Home page</Text>
      </TouchableOpacity>
    </View>
  );
}
