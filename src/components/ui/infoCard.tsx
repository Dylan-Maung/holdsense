import { View, Text } from "react-native";

interface InfoCardProps {
    title: string;
    content: string | number;
}

const InfoCard = ({ title, content }: InfoCardProps) => {
    return (
        <View className='bg-gray-800 px-4 py-2 rounded-lg'>
            <Text className='text-gray-400 text-xs'>{title}</Text>
            <Text className='text-white font-semibold'>{content}</Text>
        </View>
    );
};

export default InfoCard;