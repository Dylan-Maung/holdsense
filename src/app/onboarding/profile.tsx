import { View, Text, Button, TextInput } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useOnboarding } from '@/src/context/onboardingContext';
import { useState } from 'react';

export default function Profile() {
  const { formData, updateFormData } = useOnboarding();
  const [username, setUsername] = useState(formData.username || '');
  const [bio, setBio] = useState(formData.bio || '');

  const handleNext = () => {
    updateFormData({ username, bio })
    router.push('/onboarding/anthropometry')
  };

  return (
    <View className='flex-1 justify-center items-center'>
        <Text>Please Enter your username and bio(optional)</Text>

        <View className='flex flex-row gap-2'>
          <Text>Username: </Text>
          <TextInput onChangeText={setUsername} value={username} placeholder="Username"/>
        </View>

        <View className='flex flex-row gap-2'>
          <Text>Bio: </Text>
          <TextInput onChangeText={setBio} value={bio} placeholder="Hi, im ..."/>
        </View>
        
        <Button title="Next" onPress={handleNext}/>
    </View>
  )
}