import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputFieldProps extends TextInputProps {
    label: string;
    optional?: boolean;
    suffix?: string;
}

const InputField = ({ label, optional, suffix, ...textInputProps }: InputFieldProps) => {
    return (
        <View className='mb-4'>
            <Text className='text-white mb-2'>
                {label} 
                {optional && <Text className='text-gray-400 text-sm'> (optional)</Text>}
            </Text>

            <View className='flex-row items-center'>
                <TextInput 
                    className={
                        `text-white border border-gray-700 rounded-lg px-4 py-3 bg-gray-800 
                        ${suffix ? 'flex-1' : 'w-full'}`
                    }
                    placeholderTextColor="#9ca3af"
                    {...textInputProps}
                />
                {suffix && (
                    <Text className='text-white' style={{ marginLeft: 2, marginBottom: 18 }}>
                        {suffix}
                    </Text>
                )}
            </View>
        </View>
    );
};

export default InputField;