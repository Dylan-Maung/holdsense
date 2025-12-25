import { View, Text, Button, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import { useOnboarding } from '@/src/context/onboardingContext';
import { useAuth } from '@/src/context/auth';
import { createUserProfile } from '@/src/services/userService';

export default function ProfilePicture() {
  const { formData, updateFormData } = useOnboarding();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { user, setOnboarded } = useAuth();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePicture(uri);
      updateFormData({ profilePicture: uri });
    } else {
      Alert.alert("Image was not selected!");
    }
  };

  // Store new user in db and set onboardedFlag to true
  const handleFinish = async () => {
    await createUserProfile(profilePicture, {
      id: user!.sub,
      name: user!.name, 
      username: formData.username!,
      email: user!.email, 
      bio: formData.bio,
      homeGym: formData.homeGym,
      height: formData.height,
      reach: formData.reach,
      grade: formData.grade
    });

    setOnboarded(true);
    setTimeout(() => router.replace('/(mainTabs)/home'), 10);
  };
  
  return (
    <View className='flex-1 justify-center items-center'>
      <Text>Please set your profile picture</Text>

      {profilePicture && (
        <Image 
          source={{ uri: profilePicture }} 
          className="w-48 h-48 rounded-full my-5"
        />
      )}

      <Button title="Pick an image from camera roll" onPress={pickImage} />

      <Button title="Save and Finish" onPress={handleFinish}/>
    </View>
  )
}