import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper'
import { useColorScheme } from '@/hooks/use-color-scheme';
import "../global.css"

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (

      <PaperProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="Home" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </PaperProvider>

  );
}
