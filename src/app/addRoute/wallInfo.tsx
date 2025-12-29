import { View, Text, Image, Button, TextInput, Switch } from 'react-native'
import React, { useState } from 'react'
import { useRouteDataForm } from '@/src/context/routeContext';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PickerModal from '@/src/components/ui/pickerModal';
import uuid from 'react-native-uuid';
import { Wall } from '@/src/types/wall';

export default function wallInfo() {
    const { formData, updateFormData } = useRouteDataForm();
    const { imageUri } = useLocalSearchParams();
    const [type, setType] = useState('');
    const [angle, setAngle] = useState('');
    const [topOut, setTopOut] = useState(false);
    const [name, setName] = useState('');

    const [typeModalVisible, setTypeModalVisible] = useState(false);

    const wallTypes = ['Overhang', 'Slab', 'Vertical'];

    const addWall  = () => {
        const newWall: Wall = {
            id: uuid.v4().toString(),
            imageUri: imageUri as string,
            type: type as 'Overhang' | 'Slab' | 'Vertical',
            topOut: topOut,
            angle: Number(angle),
            name: name,
        };

        updateFormData({ 
            fullRouteImages: [...(formData.fullRouteImages || []), newWall]
        })

        router.back();
    };

    return (
        <SafeAreaView className='flex-1 bg-black items-center' edges={['top']}>
            <View className='flex h-full w-96 rounded-lg items-center'>
                <View className='w-full flex-1 border border-white rounded-lg mb-4 items-center'>
                    <Image 
                        source={{ uri: imageUri as string }} 
                        className='w-full h-full'
                    />
                </View>

                <View>
                    <PickerModal 
                        header="Wall Type"
                        selectedValue={type}
                        onValueChange={(value) => setType(value)}
                        visible={typeModalVisible}
                        onClose={() => setTypeModalVisible(false)}
                        onOpen={() => setTypeModalVisible(true)}
                        placeholder="Select Type"
                        pickerOptions={wallTypes}
                    />

                    <View className='flex flex-row mb-4 items-center justify-center'>
                        <Text className='text-white'>Wall Angle: </Text>
                        <TextInput className='text-white' keyboardType="decimal-pad" onChangeText={setAngle} value={angle} placeholder="67.9" />
                        <Text className='text-white'>°</Text>
                    </View>

                    <View className='flex flex-row mb-4 items-center justify-center'>
                        <Text className='text-white'>Top Out? </Text>
                        <Switch
                            value={topOut}
                            onValueChange={setTopOut}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={topOut ? '#3b82f6' : '#f4f3f4'}
                        />
                    </View>

                    <View className='flex flex-row mb-4 items-center justify-center'>
                        <Text className='text-white'>Wall Name: </Text>
                        <TextInput className='text-white' onChangeText={setName} value={name} placeholder="Pineapple Express"/>
                    </View>

                    <Button title="Add Wall" onPress={addWall} />
                </View>
            </View>
        </SafeAreaView>
    )
}