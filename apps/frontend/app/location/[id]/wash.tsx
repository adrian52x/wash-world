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
import { useCreateWashSession, useWashTypes } from '@/hooks/useWashSessions';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { getWashFeatures } from '@/utils';

const processSteps = [
  { label: 'Enter the hall', image: null },
  { label: 'Shampoo 1', image: step1 },
  { label: 'Shampoo 2 special', image: step2 },
  { label: 'Drying', image: step3 },
];

export default function WashProcessScreen() {
  const { id } = useLocalSearchParams();
  const [step, setStep] = useState(0);
  const router = useRouter();

  const { washTypes } = useWashTypes();
  const { createWashSession } = useCreateWashSession();

  useEffect(() => {
    // Preload all step images on mount
    [step1, step2, step3].forEach((img) => {
      Image.prefetch(Image.resolveAssetSource(img).uri);
    });
  }, []);

  // Inlcude only auto wash types
  const onlyAutoWashTypes = (washTypes ?? []).filter(
    (washType) => washType.isAutoWash,
  );

  const [selectedWash, setSelectedWash] = useState(
    onlyAutoWashTypes[1] || null,
  );

  // ensures selectedWash is set once the data is available.
  useEffect(() => {
    if (onlyAutoWashTypes.length > 0 && !selectedWash) {
      setSelectedWash(onlyAutoWashTypes[1]);
    }
  }, [onlyAutoWashTypes]);

  const handleCreateWashSession = async () => {
    await createWashSession.mutateAsync({
      washTypeId: selectedWash.washTypeId,
      locationId: Number(id),
    });
    setStep(1); // move to next step after selecting wash type and creating session
  };

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
          {/* Loading state on create Session */}
          {createWashSession.isPending && (
            <View className="absolute inset-0 z-50 justify-center items-center bg-white/60">
              <LoadingSpinner />
            </View>
          )}

          <Text className="font-header text-header font-bold mb-4">
            Choose a wash
          </Text>
          <Text className="font-subheader text-accent-gray-60 mb-4">
            Your license plate was scanned at Hall 2, please choose a wash
            program you'd like to proceed with:
          </Text>

          <View className="flex-col flex-1">
            {onlyAutoWashTypes.map((wash) => {
              const isSelected = selectedWash?.type === wash.type;
              const CheckIcon = isSelected ? CircleCheck : Circle;
              const Chevron = isSelected ? ChevronUp : ChevronDown;
              return (
                <TouchableOpacity
                  key={wash.type}
                  className={`flex-col px-2 py-3 border border-gray-300 ${
                    isSelected ? 'bg-green-light' : 'bg-white'
                  }`}
                  onPress={() => setSelectedWash(wash)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-2">
                      <CheckIcon size={20} />
                      <Text
                        className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}
                      >
                        {wash.type} - {wash.price} DKK
                      </Text>
                    </View>
                    <Chevron size={20} />
                  </View>
                  {isSelected && (
                    <View className="mt-2">
                      {getWashFeatures(wash.type)?.map((item, idx) => (
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
            onPress={handleCreateWashSession}
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
