import { View, Text, Button, TextInput } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useOnboarding } from '@/src/context/onboardingContext';
import { useState } from 'react';
import InputField from '@/src/components/ui/inputField';
import PrimaryButton from '@/src/components/ui/primaryButton';
import FormHeader from '@/src/components/ui/formHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  const { formData, updateFormData } = useOnboarding();
  const [username, setUsername] = useState(formData.username || '');
  const [bio, setBio] = useState(formData.bio || '');

  const validInput = username;

  const handleNext = () => {
    updateFormData({ username, bio })
    router.push('/onboarding/anthropometry')
  };

  return (
    <SafeAreaView className='flex-1 bg-black p-4'>
      <View className='flex-1'>
        <FormHeader step={1} totalSteps={4} title="Profile" />

        <InputField
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
        />

        <InputField
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Hi, im ..."
            multiline
            optional
        />

        <PrimaryButton
            title="Next"
            onPress={handleNext}
            disabled={!validInput}
        />
      </View>
    </SafeAreaView>
  )
}