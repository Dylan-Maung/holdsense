import { View, Text } from 'react-native'
import React from 'react'

export default function RouteCard() {
  return (
    <View className='h-full w-64 rounded-lg mr-3 flex flex-col items-center'>
      <View className='w-full flex-1 border border-white rounded-lg mb-2'>
        {/* full Route Image will go here */}
      </View>
      <Text className='text-white'>Route Name</Text>
    </View>
  )
}