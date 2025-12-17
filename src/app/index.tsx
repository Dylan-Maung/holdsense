import "../global.css"
import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Button } from 'react-native-paper'


export default function Login() {
  return (
    <View className='flex-1 justify-center items-center'>
      <Text className=' justify-center'>Login</Text>
      <Link href="/Home" push asChild>
        <Button>Navigate to Home Page</Button>
      </Link>
    </View>
  )
}