import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View, ScrollView } from 'react-native';
import { useAuth } from '../../context/auth';
import RouteCard from '@/src/components/routeCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { getRecentUserRoutes } from '@/src/services/routeService';
import { RouteData } from '@/src/types/routeData';

export default function Home() {
  const { profile, user } = useAuth();
  const [userRoutes, setUserRoutes] = useState<RouteData[]>([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      const routes = await getRecentUserRoutes(user!.sub);
      setUserRoutes(routes);
    }
    
    fetchRoutes();
  }, [user]);

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
        <Text className='text-white mb-4 text-2xl font-bold'>Welcome back!</Text>

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
            {userRoutes.map((route) => (
                <Pressable 
                  key={route.id} 
                  onPress={() => router.push(`/route/${route.id}`)}
                >
                  <RouteCard routeData={route} />
                </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}
