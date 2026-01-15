import { View, Text, Button, Alert, Pressable, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useRouteDataForm } from '@/src/context/routeContext';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import HoldCard from '@/src/components/holdCard';
import FormHeader from '@/src/components/ui/formHeader';
import PrimaryButton from '@/src/components/ui/primaryButton';
import { OPENAI_API_KEY } from '@/lib/constants';
import { readAsStringAsync } from 'expo-file-system/legacy';

export default function HoldData() {
    const { formData } = useRouteDataForm();

    interface OpenAIResponse {
        choices: {
            message: {
                content: string;
            };
        }[];
    }

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission needed', 'We need access to your photos to document routes');
            }
        })();
    }, []);
    
    const addHold = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: false,
            quality: 0.2,
            mediaTypes: 'images',
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;

            const base64 = await readAsStringAsync(uri, {
                encoding: 'base64',
            });

            
            const prompt = `You are a climbing hold classification expert. Analyze this climbing hold image carefully.

                HOLD TYPE CLASSIFICATION (look at the SHAPE and ANGLE of the gripping surface):

                JUG: Deep, positive hold you can wrap fingers around
                - Key features: Incut lip, can see underneath the hold, fingers curl inward
                - Gripping surface angles TOWARD climber (>15° incut)
                - Example: "bucket" shape, obvious edge to grab

                SLOPER: Round, smooth hold with no positive edge
                - Key features: Convex/rounded top, NO incut edge, requires open-hand grip
                - Gripping surface is flat or angles AWAY from climber
                - Example: Ball-shaped, melon-shaped, smooth dome

                CRIMP: Small edge, minimal depth
                - Gripping surface: thin horizontal edge, <1 inch deep
                - Requires fingertip grip

                PINCH: Gripped with thumb opposing fingers
                - Two opposing surfaces, squeezed together

                ORIENTATION MEASUREMENT:

                Orientation represents the angle PERPENDICULAR to where fingertips grip the hold.

                Step 1: Identify where fingertips contact the hold (the gripping edge/surface)
                Step 2: Draw a line perpendicular (90°) to that contact point
                Step 3: Measure the angle of that perpendicular line:

                - 0° = pull straight down (horizontal gripping edge, like —)
                - +90° = pull to the RIGHT (vertical edge, fingertips point left, like |)
                - -90° = pull to the LEFT (vertical edge, fingertips point right, like |)
                - +45° = pull down-right diagonal (edge angled /)
                - -45° = pull down-left diagonal (edge angled \)
                - ±180° = pull UP/undercling (upside-down edge)

                Examples:
                - If fingers grip horizontally across → force is vertical → 0° or ±180°
                - If fingers grip vertically up-down → force is horizontal → ±90°
                - If edge is diagonal / → orientation is perpendicular to that

                DO NOT default to 0°! Most holds are rotated. Measure where the fingers actually grip.

                Visual check: The orientation shows which direction you PULL, not which way fingers point.

                DUAL TEXTURE:
                Does the hold have BOTH slippery (smooth/shiny) AND textured (grippy) sections?
                Only mark true if you clearly see two different surface textures.

                CRITICAL: Return ONLY the JSON object below, with NO markdown formatting, NO backticks, NO explanation text:
                {
                "color": "simple color name",
                "orientation": number in degrees,
                "holdType": "Jug|Crimp|Sloper|Pinch|Volume|Pocket|Edge|Smear",
                "dualTexture": true/false,
                }
            `;
            
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENAI_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [
                            {
                                role: 'user',
                                content: [
                                    { type: 'text', text: prompt },
                                    { 
                                        type: 'image_url', 
                                        image_url: { 
                                            url: `data:image/jpeg;base64,${base64}`
                                        } 
                                    }
                                ]
                            }
                        ],
                        max_tokens: 300
                    })
                });
                
                const data = await response.json() as OpenAIResponse;
                const content = data.choices[0].message.content;

                let cleanedContent = content
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')      
                    .trim();

                const classification = JSON.parse(cleanedContent);

                router.push({
                    pathname: '/addRoute/holdInfo',
                    params: { imageUri: uri, classification: JSON.stringify(classification)}
                });
            } catch (e) {
                console.error('Classification error:', e);
                Alert.alert('Error', 'Failed to classify hold. Please enter manually.');
                router.push({
                    pathname: '/addRoute/holdInfo',
                    params: { imageUri: uri }
                });
            }
        } else {
            Alert.alert("Image was not selected!");
        }
    };

    const handleNext = () => {
        router.push('/addRoute/wallData')
    };

    return (
        <SafeAreaView className='flex-1 bg-black p-4'>
            <View className='flex-1 flex-col'>
                <FormHeader step={2} totalSteps={4} title="Hold Info" />

                <View className='flex flex-row w-full justify-between items-center mb-4'>
                    <Text className='text-white font-bold'>Holds</Text>

                    <View className='flex flex-row items-center justify-end gap-4 w-1/2'>
                        <Pressable onPress={addHold} className='opacity-100 active:opacity-50'>
                            <MaterialIcons name="add-circle" size={28} color="#3b82f6" />
                        </Pressable>
                        
                    </View>
                </View>

                <View className='flex-1'>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {formData.holds?.map((hold) => (
                            <HoldCard key={hold.id} hold={hold} />
                        ))}
                    </ScrollView>
                </View>
                
                <PrimaryButton
                    title="Add Wall Info"
                    onPress={handleNext}
                    disabled={false}
                />
            </View>
        </SafeAreaView>
    )
}