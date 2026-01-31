import { useAuth } from '@/src/context/auth';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginForm() {
    const {signIn} = useAuth();

    return (
        <ImageBackground 
            source={require('../../assets/images/background.jpg')}
            className='flex-1'
            resizeMode='cover'
        >
            <SafeAreaView className='flex-1'>
                <View className='flex-1 items-center justify-center px-8'>
                    <Text className='text-6xl text-white font-bold mb-16'>HoldSense</Text>
                    
                    <Pressable
                        onPress={signIn}
                        className='flex-row items-center justify-center bg-white rounded-lg p-4 w-full'
                    >
                        <AntDesign name="google" size={20} color="#4285F4" />
                        <Text className='ml-3 text-gray-800 font-semibold text-base'>
                            Sign in with Google
                        </Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}