import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper'
import "../global.css"
import { AuthProvider } from '../context/auth';

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider>
        <Stack>
          <Stack.Screen name="(protected)" options={{ headerShown: false, animation: "none" }} />
          <Stack.Screen name="login" options={{ headerShown: false, animation: "none" }} />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>
    </AuthProvider>
  );
}
