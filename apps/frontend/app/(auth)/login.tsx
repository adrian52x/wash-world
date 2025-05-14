import { View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/redux/hooks';
import { login } from '@/redux/authSlice';
import { TextInput, Button, Text } from 'react-native';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      const result = await dispatch(login({ email, password })).unwrap();
      // If login successful, AuthProvider will handle navigation
    } catch (error) {
      console.error('Login failed:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      {error ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>
      ) : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Register" onPress={() => router.push('/(auth)/signup')} />
    </View>
  );
}
