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
}

const PickerModal = ({ 
    header, 
    selectedValue, 
    onValueChange, 
    visible,
    onClose,
    onOpen,
    placeholder, 
    pickerOptions
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
            <View className='flex flex-row mb-4 items-center justify-center'>
                <Text className='text-white'>{header}:</Text>
                <Pressable  
                    onPress={onOpen} 
                    className='flex items-center justify-center bg-gray-700 rounded-lg'
                >
                    <Text className='text-white px-4'>{selectedValue || placeholder}</Text>
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