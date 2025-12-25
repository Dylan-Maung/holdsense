import { View, Text, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getUserProfile } from '@/src/services/userService'
import { useAuth } from '@/src/context/auth'
import { userProfile } from '@/src/types/userProfile'

export default function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<userProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const profile = await getUserProfile(user!.sub);
      setUserProfile(profile);
      setLoading(false);
    }
    fetchProfile();
  }, [user]);

  if (loading) return <ActivityIndicator />

  const displayPicture = userProfile?.profilePicture || user?.picture;

  return (
    <View className='flex-1 justify-center items-center'>
      <Image 
          source={{ uri: displayPicture}} 
          className="w-48 h-48 rounded-full my-5"
      />
      <Text>{userProfile!.username}</Text>
      <Text>{userProfile!.bio}</Text>
      <Text>{userProfile!.homeGym}</Text>
      <Text>{userProfile!.height}</Text>
      <Text>{userProfile!.reach}</Text>
      <Text>{userProfile!.grade}</Text>
    </View>
  )
}