import { View, Text, ScrollView, Pressable, Button, Image } from 'react-native'
import React, { useState } from 'react'
import { useRouteDataForm } from '@/src/context/routeContext'
import WallCard from '@/src/components/wallCard';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hold } from '@/src/types/hold';

export default function holdPositions() {
  const { formData, placedHolds = [] } = useRouteDataForm();
  const remainingCount = (formData.holds?.length || 0) - (placedHolds.length || 0);

  const addRoute = () => {
    router.replace('/(mainTabs)/home')
  };

  return (
    <SafeAreaView className='flex-1 bg-black p-4'>
            <View className='flex-1 flex-col'>
                <View className='flex flex-row w-full justify-between items-center mb-4'>
                  <Text className='text-white'>Select wall to place holds</Text>
                </View>

                <View className='flex-1'>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {formData.fullRouteImages?.map((wall) => (
                          <Pressable key={wall.id} onPress={() => router.push(`/addRoute/placeHold?wallId=${wall.id}`)}>
                            <View className='flex h-full w-80 rounded-lg mr-3 items-center'>
                              <View className='w-full flex-1 border border-white rounded-lg mb-2'>
                                <Image
                                    source={{ uri: wall.imageUri as string }} 
                                    className='w-full h-full'
                                />
                              </View>

                              <View className='p-2 flex items-center'>
                                <Text className='text-white'>Angle: {wall.angle}°</Text>
                                <Text className='text-white'>Holds Placed: </Text>
                              </View>
                            </View>
                          </Pressable>
                      ))}
                  </ScrollView>
                </View>
                
                <View>
                  <Text className='text-white'>Placed Holds: {placedHolds.length}</Text>
                  <Text className='text-white'>Total Holds: { (formData?.holds?.length || 0) }</Text>
                  <Text className='text-white'>Holds Remaining: {remainingCount}</Text>
                  <Button title="Save Route" onPress={addRoute}/>
                </View>
            </View>
        </SafeAreaView>
  )
}