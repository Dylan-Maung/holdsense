import { View, Text, Image } from 'react-native'
import React from 'react'
import { Wall } from '../types/wall'
import { Ionicons } from '@expo/vector-icons';


export default function WallCard({ wall }: { wall: Wall }) {
  return (
    <View className='flex h-full w-80 rounded-lg mr-3 items-center'>
      <View className='w-full flex-1 border border-white rounded-lg mb-2'>
        <Image
            source={{ uri: wall.imageUri as string }} 
            className='w-full h-full'
        />
      </View>

      <View className='p-2 flex items-center'>
        <Text className='text-white'>Type: {wall.type}</Text>
        <Text className='text-white'>Angle: {wall.angle}</Text>
        {wall.topOut? (
          <View className='flex flex-row'>
            <Text className='text-white'>Topout:</Text>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          </View>
          ) : (
            <View className='flex flex-row'>
              <Text className='text-white'>Topout:</Text>
              <Ionicons name="close-circle" size={16} color="#ef4444" />
            </View>
        )}
        <Text className='text-white'>Name: {wall.name}</Text>
      </View>
    </View>
  )
}