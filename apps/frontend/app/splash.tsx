import { View, Image } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/redux/hooks';
import { initializeAuth } from '@/redux/authSlice';

const MINIMUM_SPLASH_TIME = 2000;

export default function SplashScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  // sets min time for showing the splash, before it redirects
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      const startTime = Date.now();

      try {
        await dispatch(initializeAuth()).unwrap();
        await waitForMinimumTime(startTime);
        router.replace('/(tabs)');
      } catch (error) {
        await waitForMinimumTime(startTime);
        router.replace('/(auth)/login');
      }
    };

    const waitForMinimumTime = async (startTime: number) => {
      // Calculate remaining time to meet minimum duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MINIMUM_SPLASH_TIME - elapsedTime);
      // Wait for remaining time before navigating
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    };

    checkAuthAndNavigate();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-green-light">
      <Image
        source={require('../assets/images/logo-white.png')}
        className="w-[200px] h-[200px]"
        resizeMode="contain"
      />
    </View>
  );
}
