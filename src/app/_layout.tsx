import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper'
import "../global.css"
import { AuthProvider } from '../context/auth';
import { useAuth } from '../context/auth';

function RootLayoutNav() {
  const { user, isLoading, onboarded } = useAuth();
  
  if (isLoading) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, animation: "none" }} />

      <Stack.Protected guard={user === null}>
        <Stack.Screen name="login" options={{ headerShown: false, animation: "none" }} />
      </Stack.Protected>

      <Stack.Protected guard={user !== null && !onboarded}>
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: "none" }} />
      </Stack.Protected>

      <Stack.Protected guard={user !== null && onboarded}>
        <Stack.Screen name="(mainTabs)" options={{ headerShown: false, animation: "none" }} />
        <Stack.Screen name="addRoute" options={{ animation: "none" }} />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}
