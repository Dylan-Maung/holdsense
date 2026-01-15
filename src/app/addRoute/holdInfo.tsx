import { View, Text, Image, Switch, Pressable, Alert, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import PickerModal from '@/src/components/ui/pickerModal';
import { useRouteDataForm } from '@/src/context/routeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hold } from '@/src/types/hold';
import uuid from 'react-native-uuid';
import PrimaryButton from '@/src/components/ui/primaryButton';
import InputField from '@/src/components/ui/inputField';
import { MaterialIcons } from '@expo/vector-icons';

export default function holdInfo() {
    const { formData, updateFormData } = useRouteDataForm();
    const { imageUri, classification } = useLocalSearchParams();
    const parsedClassification = classification 
        ? JSON.parse(classification as string) 
        : null;
    const [usedBy, setUsedBy] = useState('');
    const [tag, setTag] = useState('');
    const [holdType, setHoldType] = useState(parsedClassification?.holdType || '');
    const [dualTexture, setDualTexture] = useState(parsedClassification?.dualTexture || false);
    const [orientation, setOrientation] = useState(parsedClassification?.orientation?.toString() || '');
    const [color, setColor] = useState(parsedClassification?.color || formData.color || '');
    const [usedByModalVisible, setUsedByModalVisible] = useState(false);
    const [tagModalVisible, setTagModalVisible] = useState(false);
    const [holdTypeModalVisible, setHoldTypeModalVisible] = useState(false);

    const holdRestrictions = ['Dual', 'Hand', 'Foot'];
    const holdTags = ['Middle', 'Start', 'Finish'];
    const holdTypes = ['Jug', 'Crimp', 'Sloper', 'Pinch', 'Volume', 'Pocket', 'Edge', 'Smear'];

    const validInput = usedBy && tag && holdType && orientation;

    const addHold  = () => {
        // Input Validation: 
        const errors = [];
        if (color && !/^[a-zA-Z\s]+$/.test(color)) {
            errors.push('Color should only contain letters');
        }
        if (orientation && !/^-?\d+(\.\d+)?$/.test(orientation)) {
            errors.push('Orientation must be a valid number');
        }

        if (errors.length > 0) {
            Alert.alert(
                'Please fix the following:', 
                errors.map((e, i) => `${i + 1}. ${e}`).join('\n')
            );
            return;
        }

        const newHold: Hold = {
            id: uuid.v4().toString(),
            imageUri: imageUri as string,
            usedBy: usedBy as 'Hand' | 'Foot' | 'Dual',
            tag: tag as 'Start' | 'Finish' | 'Middle',
            holdType: holdType as 'Jug' | 'Crimp' | 'Sloper' | 'Pinch' | 'Volume' | 'Pocket' | 'Edge' | 'Smear',
            dualTexture: dualTexture,
            orientation: Number(orientation),
            position: { x: 0, y: 0, z: 0, height:0, width:0 },
            color: color,
        };

        updateFormData({ 
            holds: [...(formData.holds || []), newHold]
        })

        router.back();
    };

    return (
        <SafeAreaView className='flex-1 bg-black items-center' edges={['top']}>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <View className='flex h-full w-96'>
                    <View className='flex-row items-center mb-6'>
                        <Pressable onPress={() => router.back()} className='mr-3'>
                            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                        </Pressable>

                        <View className='absolute left-0 right-0 items-center'>
                            <Text className='text-white text-2xl font-bold'>Add Hold Info</Text>
                        </View>
                    </View>
                    
                    <View className='bg-blue-900/30 border border-blue-500 rounded-lg p-3 mb-4'>
                        <View className='flex-row items-center'>
                            <MaterialIcons name="auto-fix-high" size={20} color="#3b82f6" />
                            <Text className='text-blue-400 ml-2 flex-1'>
                                AI has pre-filled certain fields. Please verify accuracy.
                            </Text>
                        </View>
                    </View>

                    <View className='w-full h-72 border border-white rounded-lg mb-4 items-center'>
                        <Image 
                            source={{ uri: imageUri as string }} 
                            className='w-full h-full'
                            resizeMode='contain'
                        />
                    </View>

                    <View>
                        <PickerModal 
                            header="Hold Tag"
                            selectedValue={tag}
                            onValueChange={(value) => setTag(value)}
                            visible={tagModalVisible}
                            onClose={() => setTagModalVisible(false)}
                            onOpen={() => setTagModalVisible(true)}
                            placeholder="Select Tag"
                            pickerOptions={holdTags}
                        />
                    
                        <PickerModal 
                            header="Hold Type"
                            selectedValue={holdType}
                            onValueChange={(value) => setHoldType(value)}
                            visible={holdTypeModalVisible}
                            onClose={() => setHoldTypeModalVisible(false)}
                            onOpen={() => setHoldTypeModalVisible(true)}
                            placeholder="Select Hold Type"
                            pickerOptions={holdTypes}
                        />

                        <InputField
                            label="Hold Orientation"
                            value={orientation}
                            onChangeText={setOrientation}
                            placeholder="67.9"
                            keyboardType="decimal-pad"
                            suffix='°'
                        />

                        <PickerModal 
                            header="Hold Restrictions"
                            selectedValue={usedBy}
                            onValueChange={(value) => setUsedBy(value)}
                            visible={usedByModalVisible}
                            onClose={() => setUsedByModalVisible(false)}
                            onOpen={() => setUsedByModalVisible(true)}
                            placeholder="Select Restriction"
                            pickerOptions={holdRestrictions}
                        />

                        <InputField
                            label="Hold Color"
                            value={color}
                            onChangeText={setColor}
                            placeholder="Purple"
                            optional
                        />

                        <View className='flex flex-row mb-4'>
                            <Text className='text-white'>Dual Texture? </Text>
                            <Switch
                                value={dualTexture}
                                onValueChange={setDualTexture}
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={dualTexture ? '#3b82f6' : '#f4f3f4'}
                            />
                        </View>

                        <PrimaryButton
                            title="Add Hold"
                            onPress={addHold}
                            disabled={!validInput}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}