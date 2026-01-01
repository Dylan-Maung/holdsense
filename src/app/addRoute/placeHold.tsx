import { View, Text, Button, Image, ScrollView, Pressable, Modal } from 'react-native'
import React, { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouteDataForm } from '@/src/context/routeContext';
import Svg, { Line } from 'react-native-svg';
import { Hold } from '@/src/types/hold';
import Slider from '@react-native-community/slider';

export default function placeHold() {
    const { formData, updateFormData,  placedHolds, setPlacedHolds } = useRouteDataForm();
    const [selectedHold, setSelectedHold] = useState<Hold | null>(null);
    const [selectedPlacedHold, setSelectedPlacedHold] = useState<Hold | null>(null);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const { wallId } = useLocalSearchParams();
    const GRID_COLS = 10;
    const GRID_ROWS = 10;
    const currWall = formData.fullRouteImages?.find(w => w.id === wallId);

    const remainingHolds = formData.holds?.filter(
        h => !placedHolds.some(p => p.id === h.id)
    ) || [];

    const updateHoldSize = (hold: Hold | null, size: number) => {
        if (!hold) {
            return
        }
        setPlacedHolds(prev => 
            prev.map(h => {
                if (h.id === hold.id) {
                    const centerX = h.position.x + (h.position.width / 2);
                    const centerY = h.position.y + (h.position.height / 2);
                    const newWidth = size / imageDimensions.width;
                    const newHeight = size / imageDimensions.height;
                    
                    return {
                        ...h,
                        position: {
                            ...h.position,
                            x: centerX - (newWidth / 2),
                            y: centerY - (newHeight / 2),
                            width: newWidth,
                            height: newHeight
                        }
                    };
                }
                return h;
            })
        )
    };

    const deleteHold = (hold: Hold | null) => {
        if (!hold) {
            return
        }
        setPlacedHolds(prev => prev.filter(h => h !== hold));
    };

    const placeHolds = () => {
        // Update formData.holds with positions from placedHolds
        const updatedHolds = formData.holds?.map(hold => {
            const placedHold = placedHolds.find(p => p.id === hold.id);
            
            if (placedHold) {
                return {
                    ...hold,
                    position: placedHold.position
                };
            }
            
            return hold;
        });
        
        updateFormData({ holds: updatedHolds });
        router.back();
    }

    return (
        <SafeAreaView className='flex-1 bg-black' edges={['top']}>
            <Text className='text-white text-center mb-2'>Place holds on wall</Text>
        
            <View className='flex-1 px-4'>
            <Pressable 
                onPress={(event) => {
                    const { locationX, locationY } = event.nativeEvent;
                    
                    if (selectedHold && imageDimensions.width > 0) {
                        const hold = formData.holds?.find(h => h === selectedHold);
                        if (!hold) return;
                        
                        const DEFAULT_SIZE = 50;
                        const normalizedX = locationX / imageDimensions.width;
                        const normalizedY = locationY / imageDimensions.height;
                        const wallAngle = currWall?.angle || 0;
                        const positionZ = (1 - normalizedY) * Math.tan(wallAngle * Math.PI / 180) * 0.5;
                        
                        const placement: Hold = {
                            ...hold,
                            position: { 
                                x: normalizedX - (DEFAULT_SIZE / imageDimensions.width / 2), 
                                y: normalizedY - (DEFAULT_SIZE / imageDimensions.height / 2), 
                                z: positionZ,
                                width: DEFAULT_SIZE / imageDimensions.width,   
                                height: DEFAULT_SIZE / imageDimensions.height
                            }
                        };
                        
                        setPlacedHolds(prev => [...prev, placement]);
                        setSelectedHold(null);
                    }
                }}
                style={{ flex: 1 }}
            >
                    <View className='flex-1 border border-white rounded-lg mb-4 overflow-hidden'>
                        <Image
                            source={{ uri: currWall?.imageUri }} 
                            className='w-full h-full'
                            onLayout={(event) => {
                                const { width, height } = event.nativeEvent.layout;
                                setImageDimensions({ width, height });
                            }}
                        />

                        <View className='absolute inset-0'>
                            <Svg width="100%" height="100%">
                                {[...Array(GRID_COLS + 1)].map((_, i) => (
                                    <Line
                                        key={`v-${i}`}
                                        x1={`${(i / GRID_COLS) * 100}%`}
                                        y1="0%"
                                        x2={`${(i / GRID_COLS) * 100}%`}
                                        y2="100%"
                                        stroke="rgba(255, 255, 255, 0.3)"
                                        strokeWidth="1"
                                    />
                                ))}
                                
                                {[...Array(GRID_ROWS + 1)].map((_, i) => (
                                    <Line
                                        key={`h-${i}`}
                                        x1="0%"
                                        y1={`${(i / GRID_ROWS) * 100}%`}
                                        x2="100%"
                                        y2={`${(i / GRID_ROWS) * 100}%`}
                                        stroke="rgba(255, 255, 255, 0.3)"
                                        strokeWidth="1"
                                    />
                                ))}
                            </Svg>
                        </View>

                        {placedHolds && placedHolds.map((placedHold) => (
                            <Pressable
                                key={placedHold.id}
                                onPress={() => setSelectedPlacedHold(placedHold)}
                                className='absolute border-2 border-blue-500'
                                style={{
                                    left: `${placedHold.position.x * 100}%`,
                                    top: `${placedHold.position.y * 100}%`,
                                    width: `${placedHold.position.width * 100}%`,
                                    height: `${placedHold.position.height * 100}%`,
                                }}
                            >
                                <Image 
                                    source={{ uri: placedHold.imageUri }} 
                                    className='w-full h-full opacity-70'
                                />
                            </Pressable>
                        ))}

                        <Modal 
                            visible={selectedPlacedHold !== null}
                            transparent={true}
                            animationType='slide'
                        >
                            {selectedPlacedHold && (
                                <View className='flex-1 items-center justify-end'>
                                    <View className="w-full rounded-lg pb-8 bg-black">
                                        <View className="bg-black">
                                            <Text className='text-white text-lg mb-4'>Adjust Hold Size</Text>
                                            <Slider
                                                style={{ width: '100%', height: 40 }}
                                                minimumValue={30}
                                                maximumValue={100}
                                                value={selectedPlacedHold.position.width * imageDimensions.width}
                                                onValueChange={(size) => updateHoldSize(selectedPlacedHold, size)}
                                                minimumTrackTintColor="#3b82f6"
                                                maximumTrackTintColor="#9ca3af"
                                            />

                                            <View className='flex-row justify-between mt-4'>
                                                <Button title="Delete" onPress={() => {
                                                    deleteHold(selectedPlacedHold);
                                                    setSelectedPlacedHold(null);
                                                }} color="red" />
                                                <Button title="Done" onPress={() => setSelectedPlacedHold(null)} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </Modal>
                    </View>
                </Pressable>
    
                <View className='h-32 mb-4'>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {remainingHolds.map((hold) => (
                            <Pressable key={hold.id} className='mr-3' onPress={() => {setSelectedHold(hold)}}>
                                <View className='w-20 items-center'>
                                <View className={`w-20 h-20 rounded-lg mb-1 overflow-hidden ${
                                        selectedHold === hold
                                            ? 'border-2 border-blue-500'
                                            : 'border border-white'
                                    }`}
                                >
                                        <Image
                                            source={{ uri: hold.imageUri as string }} 
                                            className='w-full h-full'
                                        />
                                    </View>
                                    <Text className='text-white text-xs text-center'>
                                        {hold.holdType}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
    
                <Button title="Done" onPress={placeHolds}/>
            </View>
        </SafeAreaView>
    )
}