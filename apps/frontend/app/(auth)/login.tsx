import { Keyboard, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/redux/hooks';
import { login, selectAuthError, selectAuthLoading, selectIsAuthenticated } from '@/redux/authSlice';
import { TextInput, Text, Image } from 'react-native';
import washWorldLogo from '../../assets/images/WW-logo.png';
import { Mail, Lock } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleLogin = async () => {
    await dispatch(login({ email, password })).unwrap();
    // If login successful, AuthProvider will handle navigation
    // If there's an error, it will be caught by the authError selector
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 items-center">
        {loading && 
          <View className="absolute inset-0 z-50 justify-center items-center bg-white/60">
            <LoadingSpinner />
          </View>
        }
        <Image source={washWorldLogo} resizeMode="contain" className="h-[200px] w-[200px]" />

        <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-3 w-full max-w-xs bg-white">
          <Mail color="#797777" />
          <TextInput
            className="ml-2 w-full"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#9ca3af"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View className="flex-row items-center border border-gray-300 rounded px-2 py-3 mb-6 w-full max-w-xs bg-white">
          <Lock color="#797777" />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="ml-2 w-full"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {authError ? <Text className="text-red-500 mb-6 max-w-xs">{authError}</Text> : null}
        {isAuthenticated ? <Text className="text-green-500 mb-6 max-w-xs">Success!</Text> : null}

        <TouchableOpacity className="w-full mb-4 max-w-xs px-4 py-3 bg-green-light" onPress={handleLogin}>
          <Text className="text-white font-semibold text-center">Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full max-w-xs px-4 py-3 bg-white border border-green-light"
          onPress={() => router.push('/(auth)/signup')}
        >
          <Text className="text-green-light font-semibold text-center">Sign up</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}
