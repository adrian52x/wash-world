import { useEffect } from 'react';
import { selectIsAuthenticated } from '@/redux/authSlice';
import { View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAppSelector } from './hooks';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const segments = useSegments();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!segments) return; // wait for navigation to be ready

    const inAuthGroup = segments[0] === '(auth)';

    // Add setTimeout to ensure navigation happens after mount
    setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
      }
    }, 0);
  }, [isAuthenticated, segments]);

  return <View style={{ flex: 1 }}>{children}</View>;
}
