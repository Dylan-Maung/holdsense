import { View, Text, Image } from 'react-native'
import React from 'react'
import { Hold } from '../types/hold'
import { Ionicons } from '@expo/vector-icons';


export default function HoldCard({ hold }: { hold: Hold }) {
  return (
    <View className='flex h-full w-80 rounded-lg mr-3 items-center'>
      <View className='w-full flex-1 border border-white rounded-lg mb-2'>
        <Image
            source={{ uri: hold.imageUri as string }} 
            className='w-full h-full'
        />
      </View>

      <View className='p-2'>
        <Text className='text-white'>Tag: {hold.tag}</Text>
        <Text className='text-white'>Type: {hold.holdType}</Text>
        <Text className='text-white'>Color: {hold.color}</Text>
        {hold.dualTexture ? (
          <View className='flex flex-row'>
            <Text className='text-white'>Dual Texture:</Text>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          </View>
          ) : (
            <View className='flex flex-row'>
              <Text className='text-white'>Dual Texture:</Text>
              <Ionicons name="close-circle" size={16} color="#ef4444" />
            </View>
        )}
        <Text className='text-white'>Orientation: {hold.orientation}°</Text>
        <Text className='text-white'>Restrictions: {hold.usedBy}</Text>
      </View>
    </View>
  )
}