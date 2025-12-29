import { View, Text, Image } from 'react-native'
import React from 'react'
import { RouteData } from '../types/routeData'

export default function RouteCard({ routeData }: { routeData: RouteData }) {
  return (
    <View className='h-full w-64 rounded-lg mr-3 flex flex-col items-center'>
      <View className='w-full flex-1 border border-white rounded-lg mb-2'>
        <Image
            source={{ uri: routeData.fullRouteImages[0].imageUri as string }} 
            className='w-full h-full'
        />
      </View>
      <Text className='text-white'>{routeData.color} {routeData.grade}</Text>
    </View>
  )
}