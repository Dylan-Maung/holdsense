import { View, Text, Button } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRouteDataForm } from '@/src/context/routeContext';

export default function HoldData() {
    const { formData, updateFormData } = useRouteDataForm();

    const handleNext = () => {
        router.push('/addRoute/wallData')
    };

    return (
        <SafeAreaView className='flex-1 bg-black'>
            <View>
                <Text className='text-white'>Input basic hold info</Text>
                <Text className='text-white'>{formData.gym}</Text>
                <Text className='text-white'>{formData.grade}</Text>
                <Text className='text-white'>{formData.date}</Text>
                <Text className='text-white'>{formData.status}</Text>
                <Text className='text-white'>{formData.quality}</Text>
                <Text className='text-white'>{formData.attempts}</Text>
                <Text className='text-white'>{formData.notes}</Text>
                <Text className='text-white'>{formData.setter}</Text>
                <Button title="Next" onPress={handleNext}/>
            </View>
        </SafeAreaView>
    )
}