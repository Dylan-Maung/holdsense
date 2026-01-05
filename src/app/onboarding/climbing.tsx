import { View, Text, Button, TextInput } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { useOnboarding } from '@/src/context/onboardingContext';
import {Picker} from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormHeader from '@/src/components/ui/formHeader';
import InputField from '@/src/components/ui/inputField';
import PickerModal from '@/src/components/ui/pickerModal';
import PrimaryButton from '@/src/components/ui/primaryButton';

export default function ClimbingInfo() {
  const {formData, updateFormData} = useOnboarding();
  const [homeGym, setHomeGym] = useState(formData.homeGym || '');
  const [grade, setGrade] = useState(formData.grade || '');
  const boulderGrades = [
    'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 
    'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17'
  ];
  
  const [gradeModalVisible, setGradeModalVisible] = useState(false);

  const validInput = homeGym && grade;

  const handleNext = () => {
    updateFormData({ homeGym, grade })
    router.push('/onboarding/picture')
  };

  return (
    <SafeAreaView className='flex-1 bg-black p-4'>
      <View className='flex-1'>
        <FormHeader step={3} totalSteps={4} title="Climbing Data" />

        <InputField
            label="Home Gym"
            value={homeGym}
            onChangeText={setHomeGym}
            placeholder="Dogpatch Boulders"
        />

        <PickerModal
            header="Hardest Boulder Grade"
            selectedValue={grade}
            onValueChange={(value) => setGrade(value)}
            visible={gradeModalVisible}
            onClose={() => setGradeModalVisible(false)}
            onOpen={() => setGradeModalVisible(true)}
            placeholder="Select grade"
            pickerOptions={boulderGrades}
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