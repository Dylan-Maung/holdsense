import { View, Text, Image, Button, TextInput, Switch } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import PickerModal from '@/src/components/ui/pickerModal';
import { useRouteDataForm } from '@/src/context/routeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Hold } from '@/src/types/hold';
import uuid from 'react-native-uuid';

export default function holdInfo() {
    const { formData, updateFormData } = useRouteDataForm();
    const { imageUri } = useLocalSearchParams();
    const [usedBy, setUsedBy] = useState('');
    const [tag, setTag] = useState('');
    const [holdType, setHoldType] = useState('');
    const [dualTexture, setDualTexture] = useState(false);
    const [orientation, setOrientation] = useState('');
    const [color, setColor] = useState('');
    const [usedByModalVisible, setUsedByModalVisible] = useState(false);
    const [tagModalVisible, setTagModalVisible] = useState(false);
    const [holdTypeModalVisible, setHoldTypeModalVisible] = useState(false);

    const holdRestrictions = ['Hand', 'Foot', 'Dual'];
    const holdTags = ['Start', 'Finish', 'Middle'];
    const holdTypes = ['Jug', 'Crimp', 'Sloper', 'Pinch', 'Volume', 'Pocket'];

    const addHold  = () => {
        const newHold: Hold = {
            id: uuid.v4().toString(),
            imageUri: imageUri as string,
            usedBy: usedBy as 'Hand' | 'Foot' | 'Dual',
            tag: tag as 'Start' | 'Finish' | 'Middle',
            holdType: holdType as 'Jug' | 'Crimp' | 'Sloper' | 'Pinch' | 'Volume' | 'Pocket',
            dualTexture: dualTexture,
            orientation: Number(orientation),
            position: { x: 0, y: 0, z: 0 },
            color: color,
        };

        updateFormData({ 
            holds: [...(formData.holds || []), newHold]
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

                    <View className='flex flex-row mb-4 items-center justify-center'>
                        <Text className='text-white'>Hold Color: </Text>
                        <TextInput className='text-white' onChangeText={setColor} value={color} placeholder="Red"/>
                    </View>

                    <View className='flex flex-row mb-4 items-center justify-center'>
                        <Text className='text-white'>Dual Texture? </Text>
                        <Switch
                            value={dualTexture}
                            onValueChange={setDualTexture}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={dualTexture ? '#3b82f6' : '#f4f3f4'}
                        />
                    </View>

                    <View className='flex flex-row mb-4 items-center justify-center'>
                        <Text className='text-white'>Hold Orientation: </Text>
                        <TextInput className='text-white' keyboardType="decimal-pad" onChangeText={setOrientation} value={orientation} placeholder="67.9" />
                        <Text className='text-white'>°</Text>
                    </View>

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

                    <Button title="Add Hold" onPress={addHold} />
                </View>
            </View>
        </SafeAreaView>
    )
}