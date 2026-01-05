import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PrimaryButton from '@/src/components/ui/primaryButton';

export default function OnboardingEntryPoint() {
    return (
        <SafeAreaView className='flex-1 bg-black p-4'>
            <View className='flex-1 justify-center items-center gap-6'>
                <Text className='text-white text-center text-2xl'>
                    Welcome to Holdsense! Let's get to know you so we can personalize your experience.
                </Text>
                
                <PrimaryButton
                    title="Let's get started"
                    onPress={() => router.push('/onboarding/profile')}
                    disabled={false}
                />
            </View>
        </SafeAreaView>
    )
}