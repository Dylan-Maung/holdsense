import { View, Text, Button, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker';
import { useOnboarding } from '@/src/context/onboardingContext';
import { useAuth } from '@/src/context/auth';
import { createUserProfile, getUserProfile } from '@/src/services/userService';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormHeader from '@/src/components/ui/formHeader';
import PrimaryButton from '@/src/components/ui/primaryButton';

export default function ProfilePicture() {
  const { formData, updateFormData } = useOnboarding();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const { user, setOnboarded, setProfile} = useAuth();

  const validInput = profilePicture;

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.2,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setProfilePicture(uri);
      updateFormData({ profilePicture: uri });
    } else {
      Alert.alert("Image was not selected!");
    }
  };

  // Store new user in db and set onboarded flag to true
  const handleFinish = async () => {
    console.log('Full user object:', user);  // ✅ Add this
    console.log('user.firebase_uid:', user?.firebase_uid);  // ✅ Add this
    console.log('user.sub:', user?.sub);  // ✅ Add this
    
    if (!user?.firebase_uid) {  // ✅ Safety check
        console.error('No firebase_uid available!');
        Alert.alert('Error', 'Authentication issue. Please sign out and back in.');
        return;
    }
    await createUserProfile(profilePicture, {
      id: user!.sub,
      uid: user!.firebase_uid,
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
    const newProfile = await getUserProfile(user!.firebase_uid)
    setProfile(newProfile);
    router.replace('/(mainTabs)/home');
  };
  
  return (
    <SafeAreaView className='flex-1 bg-black p-4'>
      <View className='flex-1 flex gap-6'>
        <FormHeader step={4} totalSteps={4} title="Profile Picture" />

        {profilePicture && (
          <View className='flex items-center'>
            <Image 
              source={{ uri: profilePicture }} 
              className="w-48 h-48 rounded-full my-5"
            />
          </View>
        )}

        <PrimaryButton
            title="Select an image from your camera roll"
            onPress={pickImage}
            disabled={false}
        />

        <PrimaryButton
            title="Save and Finish"
            onPress={handleFinish}
            disabled={!validInput}
        />
      </View>
    </SafeAreaView>
  )
}