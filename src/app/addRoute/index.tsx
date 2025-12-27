import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';

export default function routeInfo() {

    const handleNext = () => {
        router.push('/addRoute/holdData')
    };

    return (
        <SafeAreaView className='flex-1 bg-black'>
            <View>
                <Text className='text-white'>Input basic route info</Text>
                <Button title="Next" onPress={handleNext}/>
            </View>
        </SafeAreaView>
    )
}