import { View, Text, Image, ActivityIndicator, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '@/src/services/userService'
import { useAuth } from '@/src/context/auth'
import { UserProfile } from '@/src/types/userProfile'
import { Alert } from 'react-native'
import PrimaryButton from '@/src/components/ui/primaryButton'

export default function Profile() {
  const { user, signOut } = useAuth();
  const [UserProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile(user?.firebase_uid as string);
      setUserProfile(profile);
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    Alert.alert("Logging Out", "Are you sure you want to proceed?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Confirm",
        style: "destructive",
        onPress: signOut
      },
    ]);
  };

  if (loading) return <ActivityIndicator />

  const displayPicture = UserProfile?.profilePicture || user?.picture;

  return (
    <View className='flex-1 bg-black p-4'>
      <View className='flex flex-row w-full h-1/2 items-center'>
        <View className='flex w-1/2 h-full items-center justify-center items-center'>
          <Text className='text-white text-xl uppercase font-bold'>{UserProfile!.username}</Text>
          <Image 
              source={{ uri: displayPicture}} 
              className="w-48 h-48 rounded-full my-5 border border-red-700"
          />
          <Text className='text-white'>{UserProfile!.bio}</Text>
        </View>

        <View className='flex w-1/2 h-1/3 items-center justify-center items-center'>
          <View className='flex flex-row w-full h-1/2 items-center justify-center items-center gap-4'>
            <View className='flex items-center justify-center'>
              <Text className='text-white'>{UserProfile!.homeGym}</Text>
              <Text className='text-gray-400'>Home Gym</Text>
            </View>
            <View className='flex items-center justify-center'>
              <Text className='text-white'>{UserProfile!.grade}</Text>
              <Text className='text-gray-400'>Grade</Text>
            </View>
          </View>

          <View className='flex flex-row w-full h-1/2 items-center justify-center items-center gap-4'>
            <View className='flex items-center justify-center'>
              <Text className='text-white'>{UserProfile!.height}{"\""}</Text>
              <Text className='text-gray-400'>Height</Text>
            </View>
            <View className='flex items-center justify-center'>
              <Text className='text-white'>{UserProfile!.reach}</Text>
              <Text className='text-gray-400'>Reach</Text>
            </View>
          </View>
        </View>

      </View>

      <PrimaryButton
          title="Sign Out"
          onPress={handleLogout}
          disabled={false}
      />
    </View>
  )
}