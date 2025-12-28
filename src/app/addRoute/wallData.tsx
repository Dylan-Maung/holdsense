import { View, Text, Button } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WallData() {

    const handleNext = () => {
        router.replace('/(mainTabs)/home')
    };

    return (
        <SafeAreaView className='flex-1 bg-black'>
            <View>
                <Text className='text-white'>Input wall info</Text>
                <Button title="Finish" onPress={handleNext}/>
            </View>
        </SafeAreaView> 
    )
}