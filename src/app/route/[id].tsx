import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { RouteData } from '@/src/types/routeData';
import { getRouteById } from '@/src/services/routeService';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImageCarousel from '@/src/components/ui/imageCarousel';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import InfoCard from '@/src/components/ui/infoCard';
import { GenerateBeta } from '@/src/services/betaService';
import PrimaryButton from '@/src/components/ui/primaryButton';
import { UserProfile } from '@/src/types/userProfile';
import { useAuth } from '@/src/context/auth';
import { getUserProfile } from '@/src/services/userService';

export default function RouteDetails() {
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const [route, setRoute] = useState<RouteData | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [generatedBeta, setGeneratedBeta] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchRoutes = async () => {
            const route = await getRouteById(id as string);
            setRoute(route);
        }

        const fetchProfile = async () => {
            const profile = await getUserProfile(user!.sub);
            setUserProfile(profile);
            setLoading(false);
        }

        fetchRoutes();
        fetchProfile();
    }, [id, user]);

    if (!route) {
        return (
            <SafeAreaView className='flex-1 bg-black items-center justify-center'>
                <Text className='text-white'>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (loading) return <ActivityIndicator />

    const handleBetaGeneration = async () => {
        setIsGenerating(true);
        try {
            const beta = await GenerateBeta(route, userProfile!);
            setGeneratedBeta(beta);
        } catch (error) {
            console.error('Beta generation error:', error);
            Alert.alert('Error', 'Failed to generate beta. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <SafeAreaView className='flex-1 bg-black' edges={['top']}>
            <ScrollView className='flex-1'>
                <View className='p-4'>
                    <View className='flex-row items-center mb-6'>
                        <Pressable onPress={() => router.back()} className='mr-3'>
                            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                        </Pressable>
                        <View className='flex flex-row'>
                            <Text className='text-white text-xl font-bold'>
                                {route.color} {route.grade} •{" "}   
                            </Text>
                            <Text className='text-blue-400 text-xl font-bold'>
                                {route.gym} 
                            </Text>
                        </View>
                    </View>

                    <View className='mb-6'>
                        <Text className='text-white text-lg font-semibold mb-2 border-b border-gray-700 pb-2'>
                            Route Info
                        </Text>
                        <View className='flex-row flex-wrap gap-4'>
                            <InfoCard title="Setter" content={route.setter as string} />
                            <InfoCard title="Quality" content={route.quality as number} />
                        </View>
                    </View>

                    <View className='mb-6'>
                        <Text className='text-white text-lg font-semibold mb-2 border-b border-gray-700 pb-2'>
                            Stats
                        </Text>
                        
                        <View className='flex-row flex-wrap gap-4'>
                            <InfoCard title="Date" content={route.date} />
                            <InfoCard title="Attempts" content={route.attempts} />
                            <InfoCard title="Status" content={route.status} />
                        </View>

                    </View>

                    <View className='mb-4'>
                        <Text className='text-white mb-2 border-b border-gray-700'>Holds</Text>
                        <ImageCarousel items={route.holds} />
                    </View>

                    <View className='mb-4'>
                        <Text className='text-white mb-2 border-b border-gray-700'>Walls</Text>
                        <ImageCarousel items={route.fullRouteImages} />
                    </View>

                    <View className='mb-4'>
                        <InfoCard title="Route Notes" content={route.notes as string} />
                    </View>

                    <View>
                        <Text className='text-white text-lg font-semibold mb-2 border-b border-gray-700 pb-2'>
                            AI Beta Generation
                        </Text>
                        
                        {!generatedBeta ? (
                            <PrimaryButton
                                title={isGenerating ? "Generating..." : "Generate Beta"}
                                onPress={handleBetaGeneration}
                                disabled={isGenerating}
                            />
                        ) : (
                            <View>
                                <Text className='text-white mb-4'>{generatedBeta}</Text>
                                <Pressable onPress={handleBetaGeneration}>
                                    <Text className='text-blue-500'>Regenerate</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}