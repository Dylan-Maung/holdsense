import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface FormHeaderProps {
    step: number;
    totalSteps: number;
    title: string;
}

const FormHeader = ({ step, totalSteps, title }: FormHeaderProps) => {
    return (
        <View className='flex-row items-center mb-6'>
            <Pressable onPress={() => router.back()} className='mr-3'>
                <MaterialIcons name="arrow-back-ios" size={24} color="white" />
            </Pressable>
            <Text className='text-gray-400 text-sm mr-3'>Step {step} of {totalSteps}</Text>
            <View className='absolute left-0 right-0 items-center'>
                <Text className='text-white text-2xl font-bold'>{title}</Text>
            </View>
        </View>
    );
};

export default FormHeader;