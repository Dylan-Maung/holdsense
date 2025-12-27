import React from 'react';
import { ActivityIndicator, Pressable, Text, View, ScrollView } from 'react-native';
import { useAuth } from '../../context/auth';
import RouteCard from '@/src/components/routeCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

export default function Home() {
  const { profile } = useAuth();

  if (!profile) {
    return (
      <View className='flex-1 justify-center items-center'>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView className='flex-1 bg-black' edges={['top']}>
      <View className='flex-1 px-4'>
        <Text className='text-white mb-4'>Welcome back {profile!.username} !</Text>

        <View className='flex flex-row justify-between items-center mb-4'>
          <Text className='text-white'>Routes</Text>
          <View className='flex flex-row items-center justify-end gap-4 w-1/2'>
            <Pressable onPress={() => router.push('/addRoute')}>
              <MaterialIcons name="add-circle" size={28} color="#3b82f6" />
            </Pressable>
            <Pressable onPress={() => console.log('Clicked!')}>
              <Text className='text-gray-400'>View All</Text>
            </Pressable>
          </View>
        </View>

        <View className='h-1/5'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <RouteCard />
            <RouteCard />
            <RouteCard />
            <RouteCard />
            <RouteCard />
            <RouteCard />
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}
