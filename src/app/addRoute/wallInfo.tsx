import { View, Text, Image, Switch, Alert, Pressable } from 'react-native'
import React, { useState } from 'react'
import { useRouteDataForm } from '@/src/context/routeContext';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import PickerModal from '@/src/components/ui/pickerModal';
import uuid from 'react-native-uuid';
import { Wall } from '@/src/types/wall';
import PrimaryButton from '@/src/components/ui/primaryButton';
import InputField from '@/src/components/ui/inputField';
import { MaterialIcons } from '@expo/vector-icons';

export default function wallInfo() {
    const { formData, updateFormData } = useRouteDataForm();
    const { imageUri } = useLocalSearchParams();
    const [type, setType] = useState('');
    const [angle, setAngle] = useState('');
    const [topOut, setTopOut] = useState(false);
    const [name, setName] = useState('');

    const [typeModalVisible, setTypeModalVisible] = useState(false);

    const wallTypes = ['Overhang', 'Slab', 'Vertical'];

    
    const validInput = type && angle;

    const addWall  = () => {
        // Input Validation: 
        const errors = [];
        if (angle && !/^-?\d+(\.\d+)?$/.test(angle)) {
            errors.push('Orientation must be a valid number');
        }

        if (errors.length > 0) {
            Alert.alert(
                'Please fix the following:', 
                errors.map((e, i) => `${i + 1}. ${e}`).join('\n')
            );
            return;
        }

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
        <SafeAreaView className='flex-1 bg-black' edges={['top']}>
            <View className='flex-1 p-4'>
                <View className='flex-row w-full items-center mb-6'>
                    <Pressable onPress={() => router.back()} className='mr-3'>
                        <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                    </Pressable>

                    <View className='absolute left-0 right-0 items-center'>
                        <Text className='text-white text-2xl font-bold'>Add Wall Info</Text>
                    </View>
                </View>

                <View className='w-full h-96 border border-white rounded-lg mb-4 items-center'>
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

                    <InputField
                        label="Wall Angle"
                        value={angle}
                        onChangeText={setAngle}
                        placeholder="67.9"
                        keyboardType="decimal-pad"
                        suffix='°'
                    />

                    <InputField
                        label="Wall Name"
                        value={name}
                        onChangeText={setName}
                        placeholder="Pineapple Express"
                        optional
                    />

                    <View className='flex flex-row mb-4'>
                        <Text className='text-white'>Top Out? </Text>
                        <Switch
                            value={topOut}
                            onValueChange={setTopOut}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={topOut ? '#3b82f6' : '#f4f3f4'}
                        />
                    </View>

                    <PrimaryButton
                        title="Add Wall"
                        onPress={addWall}
                        disabled={!validInput}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}