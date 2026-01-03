import { Image, Pressable, ScrollView, View } from "react-native";
import { Hold } from '@/src/types/hold';
import { Wall } from '@/src/types/wall';

interface ImageCarouselProps {
    items: Hold[] | Wall[];
    onItemPress?: (item: any) => void;
}

const ImageCarousel = ({ items, onItemPress }: ImageCarouselProps) => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {items.map((item) => (
                <Pressable 
                    key={item.id}
                    onPress={() => onItemPress?.(item)}
                >
                    <View className='w-64 h-64 rounded-lg mr-3'>
                        <View className='w-full h-full border border-white rounded-lg overflow-hidden'>
                            <Image
                                source={{ uri: item.imageUri }} 
                                className='w-full h-full'
                                resizeMode='cover'
                            />
                        </View>
                    </View>
                </Pressable>
            ))}
        </ScrollView>     
    )
}

export default ImageCarousel;