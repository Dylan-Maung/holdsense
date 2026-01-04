import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native'
import { useRouteDataForm } from '@/src/context/routeContext'
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createRoute } from '@/src/services/routeService';
import { RouteData } from '@/src/types/routeData';
import uuid from 'react-native-uuid';
import { useAuth } from '@/src/context/auth';
import FormHeader from '@/src/components/ui/formHeader';
import InfoCard from '@/src/components/ui/infoCard';
import PrimaryButton from '@/src/components/ui/primaryButton';

export default function holdPositions() {
  const { formData, placedHolds = [] } = useRouteDataForm();
  const { user } = useAuth();
  const remainingCount = (formData.holds?.length || 0) - (placedHolds.length || 0);

  const addRoute = async () => {
    try {
        if (!formData.holds || !formData.fullRouteImages || !formData.grade || !formData.gym || (remainingCount !== 0)) {
            Alert.alert('Error', 'Missing required route information');
            return;
        }
        
        const routeData: RouteData = {
            id: uuid.v4().toString(),
            userId: user!.sub,
            grade: formData.grade,
            gym: formData.gym,
            date: formData.date || new Date().toISOString().split('T')[0],
            status: formData.status || 'Project',
            quality: formData.quality || 0,
            attempts: formData.attempts || 1,
            color: formData.color || '',
            holds: formData.holds,
            fullRouteImages: formData.fullRouteImages,
            notes: formData.notes,
            setter: formData.setter,
        };
        
        await createRoute(routeData.holds, routeData.fullRouteImages, routeData);
        router.replace('/(mainTabs)/home');
    } catch (error) {
        console.error('Error creating route:', error);
        Alert.alert('Error', 'Failed to save route');
    }
};

  return (
    <SafeAreaView className='flex-1 bg-black p-4'>
            <View className='flex-1 flex-col'>
              <FormHeader step={4} totalSteps={4} title="Hold Positions" />

                <View className='flex flex-row w-full justify-between items-center mb-4'>
                  <Text className='text-white'>Select wall to place holds</Text>
                </View>

                <View className='flex-1 mb-4'>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {formData.fullRouteImages?.map((wall) => (
                          <Pressable key={wall.id} onPress={() => router.push(`/addRoute/placeHold?wallId=${wall.id}`)}>
                            <View className='flex h-full w-80 rounded-lg mr-3 items-center'>
                              <View className='w-full flex-1 border border-white rounded-lg mb-2'>
                                <Image
                                    source={{ uri: wall.imageUri as string }} 
                                    className='w-full h-full'
                                />
                              </View>

                              <View className='p-2 flex items-center'>
                                <Text className='text-white'>Angle: {wall.angle}°</Text>
                              </View>
                            </View>
                          </Pressable>
                      ))}
                  </ScrollView>
                </View>
                
                <View className='flex-1 gap-4'>
                  <InfoCard title='Placed Holds' content={placedHolds.length}/>
                  <InfoCard title='Total Holds' content={(formData?.holds?.length || 0)}/>
                  <InfoCard title='Holds Remaining' content={remainingCount}/>
                </View>
                
                <PrimaryButton
                    title="Save Route"
                    onPress={addRoute}
                    disabled={false}
                />
            </View>
        </SafeAreaView>
  )
}