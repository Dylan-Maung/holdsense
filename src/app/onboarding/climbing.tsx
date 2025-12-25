import { View, Text, Button, TextInput } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { useOnboarding } from '@/src/context/onboardingContext';
import {Picker} from '@react-native-picker/picker';

export default function ClimbingInfo() {
  const {formData, updateFormData} = useOnboarding();
  const [homeGym, setHomeGym] = useState(formData.homeGym || '');
  const [grade, setGrade] = useState(formData.grade || '');
  const boulderGrades = ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'];
  

  const handleNext = () => {
    updateFormData({ homeGym, grade })
    router.push('/onboarding/picture')
  };

  return (
    <View className='flex-1 justify-center items-center'>
        <Text>Please input climbing data</Text>

        <View className='flex flex-row gap-2'>
          <Text>Home Gym: </Text>
          <TextInput onChangeText={setHomeGym} value={homeGym} placeholder="Dogpatch Boulders"/>
        </View>

        <View className='flex flex-row gap-2'>
          <Text>Hardest Boulder Grade: </Text>
          <Picker
            selectedValue={grade}
            onValueChange={(itemValue, itemIndex) =>
              setGrade(itemValue)
            }>
            {boulderGrades.map((grade) => (
              <Picker.Item key={grade} label={grade} value={grade} />
            ))}
          </Picker>
        </View>
        
        <Button title="Next" onPress={handleNext}/>
    </View>
  )
}