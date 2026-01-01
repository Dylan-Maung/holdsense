import { View, Text, ScrollView, Pressable, Button, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouteDataForm } from '@/src/context/routeContext'
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createRoute } from '@/src/services/routeService';
import { RouteData } from '@/src/types/routeData';
import uuid from 'react-native-uuid';
import { useAuth } from '@/src/context/auth';

export default function holdPositions() {
  const { formData, placedHolds = [] } = useRouteDataForm();
  const { user } = useAuth();
  const remainingCount = (formData.holds?.length || 0) - (placedHolds.length || 0);

  const addRoute = async () => {
    try {
        if (!formData.holds || !formData.fullRouteImages || !formData.grade || !formData.gym || (remainingCount !== 0)) {
            Alert.alert('Error', 'Missing required route information');
            return;
        }
        
        const routeData: RouteData = {
            id: uuid.v4().toString(),
            userId: user!.sub,
            grade: formData.grade,
            gym: formData.gym,
            date: formData.date || new Date().toISOString().split('T')[0],
            status: formData.status || 'Project',
            quality: formData.quality || 0,
            attempts: formData.attempts || 1,
            color: formData.color || '',
            holds: formData.holds,
            fullRouteImages: formData.fullRouteImages,
            notes: formData.notes,
            setter: formData.setter,
        };
        
        await createRoute(routeData.holds, routeData.fullRouteImages, routeData);
        router.replace('/(mainTabs)/home');
    } catch (error) {
        console.error('Error creating route:', error);
        Alert.alert('Error', 'Failed to save route');
    }
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