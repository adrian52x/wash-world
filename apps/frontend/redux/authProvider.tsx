import { useEffect } from 'react';
import { fetchUserSession, selectIsAuthenticated } from '@/redux/authSlice';
import { View } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAppSelector, useAppDispatch } from './hooks';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const segments = useSegments(); // the routes
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!segments) return; // wait for navigation to be ready

    const inAuthGroup = segments[0] === '(auth)';
    const inSplashScreen = segments[0] === 'splash';

    // Don't handle routing if we're in splash screen
    if (inSplashScreen) return;

    // Add a small delay to ensure splash screen navigation completes first
    const timer = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        router.replace('/(tabs)');
        // Fetch user session data when authenticated
        dispatch(fetchUserSession({}));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, segments]);

  return <View style={{ flex: 1 }}>{children}</View>;
}
