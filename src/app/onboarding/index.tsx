import { View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function OnboardingEntryPoint() {
    return (
        <View className='flex-1 justify-center items-center'>
            <Text>Hi Welcome to Holdsense, Before we get started let us and others learn more about you</Text>
            <Button title="Let's get started" onPress={() => router.push('/onboarding/profile')}/>
        </View>
    )
}