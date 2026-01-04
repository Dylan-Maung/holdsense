import { PickerIOS } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { View, Modal, Pressable, Text } from "react-native";

interface PickerModalProps {
    header: string;
    selectedValue: string;
    onValueChange: (value: string) => void;
    visible: boolean;
    onClose: () => void;
    onOpen: () => void;
    placeholder: string;
    pickerOptions: string[];
    optional?: boolean;
}

const PickerModal = ({ 
    header, 
    selectedValue, 
    onValueChange, 
    visible,
    onClose,
    onOpen,
    placeholder, 
    pickerOptions,
    optional
}: PickerModalProps) => {
    const [tempValue, setTempValue] = useState(selectedValue || pickerOptions[0]);

    useEffect(() => {
        setTempValue(selectedValue || pickerOptions[0])
    }, [visible, selectedValue])

    const handleDone = () => {
        onValueChange(tempValue);
        onClose();
    };

    return (
        <View>
            <View className='mb-4'>
                <Text className='text-white mb-2'>
                    {header} 
                    {optional && <Text className='text-gray-400 text-sm'> (optional)</Text>}
                </Text>
                
                <Pressable  
                    onPress={onOpen} 
                    className='text-white border border-gray-700 rounded-lg px-4 py-3 bg-gray-800'
                >
                    <Text className={selectedValue ? 'text-white' : 'text-gray-400'}>
                        {selectedValue || placeholder}
                    </Text>
                </Pressable>
            </View>
            
            <Modal
                visible={visible}
                transparent={true}
                animationType='slide'
                onRequestClose={onClose}
            >   
                <View className='flex-1 items-center justify-end'>
                    <View className="w-full rounded-lg">
                        <View className="bg-black">
                            <PickerIOS
                                selectedValue={tempValue}
                                onValueChange={(value) => onValueChange(value as string)}
                                itemStyle={{ 
                                    color: 'white',
                                    fontSize: 20
                                }}
                            >
                                {pickerOptions.map((pickerOption) => (
                                    <PickerIOS.Item key={pickerOption} label={pickerOption} value={pickerOption} />
                                ))}
                            </PickerIOS>
                        </View>

                        <View className="flex items-center p-4 bg-black">
                            <Pressable onPress={handleDone}>
                                <Text className="text-blue-500 text-lg font-semibold">Done</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default PickerModal;