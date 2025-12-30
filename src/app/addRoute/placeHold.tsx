import { View, Text, Button, Image, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouteDataForm } from '@/src/context/routeContext';

export default function placeHold() {
    const { formData, setPlacedHolds } = useRouteDataForm();
    const { wallId } = useLocalSearchParams();

    const currWall = formData.fullRouteImages?.find(w => w.id === wallId);

    const placeHolds = () => {
        router.back();
    }

    return (
        <SafeAreaView className='flex-1 bg-black items-center' edges={['top']}>
            <Text className='text-white'>Place holds on wall</Text>

            <View className='flex h-full w-96 rounded-lg items-center border border-red-400'>
                <View className='w-full flex-1 border border-white rounded-lg mb-4 items-center'>
                    <Image
                        source={{ uri: currWall?.imageUri }} 
                        className='w-full h-full'
                        resizeMode='contain'
                    />
                </View>

                <View className='flex-1'>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {formData.holds?.map((hold) => (
                            <Pressable key={hold.id} className='mr-3'>
                                <View className='flex w-24 h-24 rounded-lg items-center'>
                                    <View className='w-full flex-1 border border-white rounded-lg mb-2'>
                                        <Image
                                            source={{ uri: hold.imageUri as string }} 
                                            className='w-full h-full'
                                        />
                                    </View>

                                    <View className='p-2 flex text-xs items-center'>
                                        <Text className='text-white'>{hold.color} {hold.holdType}</Text>
                                    </View>
                                    </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                <Button title="Done" onPress={placeHolds}/>
            </View>
        </SafeAreaView>
    )
}