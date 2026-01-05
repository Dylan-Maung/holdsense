import { View, Text, Button, TextInput, Alert } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { useOnboarding } from '@/src/context/onboardingContext';
import { useState } from 'react';
import FormHeader from '@/src/components/ui/formHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '@/src/components/ui/inputField';
import PrimaryButton from '@/src/components/ui/primaryButton';

export default function Anthropometry() {
  const {formData, updateFormData} = useOnboarding();
  const [height, setHeight] = useState(formData.height?.toString() || '');
  const [reach, setReach] = useState(formData.reach?.toString() || '');

  const validInput = height && reach;

  const handleNext = () => {
    // Input Validation: 
    const errors = [];
    if (height && !/^\d+(\.\d+)?$/.test(height)) {
      errors.push('Height must only contain numbers');
    }
    if (reach && !/^-?\d+$/.test(reach)) {
      errors.push('Ape index must be a whole number');
    }

    if (errors.length > 0) {
        Alert.alert(
            'Please fix the following:', 
            errors.map((e, i) => `${i + 1}. ${e}`).join('\n')
        );
        return;
    }

    updateFormData({ 
      height: parseFloat(height) || undefined, 
      reach: parseFloat(reach) || undefined
    })
    router.push('/onboarding/climbing')
  };

  return (
    <SafeAreaView className='flex-1 bg-black p-4'>
      <View className='flex-1'>
        <FormHeader step={2} totalSteps={4} title="Anthropometry" />

        <InputField
            label="Height"
            value={height}
            onChangeText={setHeight}
            placeholder="67.9"
            suffix="in."
        />

        <InputField
            label="Reach"
            value={reach}
            onChangeText={setReach}
            placeholder="-1"
            keyboardType="numeric"
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