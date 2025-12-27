import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function HoldData() {
    const handleNext = () => {
        router.push('/addRoute/wallData')
    };

    return (
        <SafeAreaView className='flex-1 bg-black'>
            <View>
                <Text className='text-white'>Input basic hold info</Text>
                <Button title="Next" onPress={handleNext}/>
            </View>
        </SafeAreaView>
    )
}