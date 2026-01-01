import { View, Text, Button, Alert, Pressable, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRouteDataForm } from '@/src/context/routeContext';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HoldCard from '@/src/components/holdCard';

export default function HoldData() {
    const { formData } = useRouteDataForm();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'We need access to your photos to document routes');
            }
        })();
    }, []);
    
    const addHold = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 0.2,
            mediaTypes: 'images',
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            router.push({
                pathname: '/addRoute/holdInfo',
                params: { imageUri: uri }
            });
        } else {
            Alert.alert("Image was not selected!");
        }
    };

    const handleNext = () => {
        router.push('/addRoute/wallData')
    };

    return (
        <SafeAreaView className='flex-1 bg-black p-4'>
            <View className='flex-1 flex-col'>
                <View className='flex flex-row w-full justify-between items-center mb-4'>
                    <Text className='text-white font-bold'>Holds</Text>

                    <View className='flex flex-row items-center justify-end gap-4 w-1/2'>
                        <Pressable onPress={addHold} className='opacity-100 active:opacity-50'>
                            <MaterialIcons name="add-circle" size={28} color="#3b82f6" />
                        </Pressable>
                        
                    </View>
                </View>

                <View className='flex-1'>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {formData.holds?.map((hold) => (
                            <HoldCard key={hold.id} hold={hold} />
                        ))}
                    </ScrollView>
                </View>

                <Button title="Add Wall Info" onPress={handleNext}/>
            </View>
        </SafeAreaView>
    )
}