import React from 'react';
import { Button, Text, View } from 'react-native';
import { useAuth } from '../../context/auth';

export default function Home() {
  const { user, signOut } = useAuth();

  return (
    <View className='flex-1 bg-red-400'>
      <Text>Welcome {user!.name}</Text>
      <Button title="Sign Out" onPress={signOut}/>
    </View>
  )
}
