import { Stack, Redirect } from 'expo-router';
import { useAuth } from '@/src/context/auth';

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth();

    if (isLoading) {
        console.log("isLoading Protected")
        return null;
      }
    
    if (!user) {
        console.log("Not authenticated user redirect to login")
        return <Redirect href="/login" />;
    }

  return (
        <Stack> 
            <Stack.Screen name="(mainTabs)" options={{ headerShown: false}}/>
        </Stack>   
  );
}