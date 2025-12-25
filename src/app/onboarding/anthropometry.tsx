import { View, Text, Button, TextInput } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useOnboarding } from '@/src/context/onboardingContext';
import { useState } from 'react';

export default function Anthropometry() {
  const {formData, updateFormData} = useOnboarding();
  const [height, setHeight] = useState(formData.height?.toString() || '');
  const [reach, setReach] = useState(formData.reach?.toString() || '');

  const handleNext = () => {
    updateFormData({ 
      height: parseFloat(height) || undefined, 
      reach: parseFloat(reach) || undefined
    })
    router.push('/onboarding/climbing')
  };

  return (
    <View className='flex-1 justify-center items-center'>
      <Text>Please input body metrics</Text>

      <View className='flex flex-row gap-2'>
        <Text>Height: </Text>
        <TextInput keyboardType="decimal-pad" onChangeText={setHeight} value={height} placeholder="67.9" />
        <Text>in.</Text>
      </View>

      <View className='flex flex-row gap-2'>
        <Text>Reach: </Text>
        <TextInput onChangeText={setReach} value={reach} placeholder='-1'/>
        <Text>in.</Text>
      </View>

      <Button title="Next" onPress={handleNext}/>
    </View>
  )
}