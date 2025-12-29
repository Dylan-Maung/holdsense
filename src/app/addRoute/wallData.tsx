import { View, Text, Button, Pressable, Alert, ScrollView } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouteDataForm } from '@/src/context/routeContext';
import WallCard from '@/src/components/wallCard';

export default function WallData() {
    const { formData } = useRouteDataForm();
    const addWall = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            router.push({
                pathname: '/addRoute/wallInfo',
                params: { imageUri: uri }
            });
        } else {
            Alert.alert("Image was not selected!");
        }
    };

    const handleNext = () => {
        router.replace('/(mainTabs)/home')
    };

    return (
        <SafeAreaView className='flex-1 bg-black p-4'>
            <View className='flex-1 flex-col'>
                <View className='flex flex-row w-full justify-between items-center mb-4'>
                    <Text className='text-white font-bold'>Walls</Text>

                    <View className='flex flex-row items-center justify-end gap-4 w-1/2'>
                        <Pressable onPress={addWall} className='opacity-100 active:opacity-50'>
                            <MaterialIcons name="add-circle" size={28} color="#3b82f6" />
                        </Pressable>
                        
                    </View>
                </View>

                <View className='flex-1'>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {formData.fullRouteImages?.map((wall) => (
                            <WallCard key={wall.id} wall={wall} />
                        ))}
                    </ScrollView>
                </View>

                <Button title="Map Hold Positions" onPress={handleNext}/>
            </View>
        </SafeAreaView>
    )
}