import { View, Text, Modal, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router';
import { useRouteDataForm } from '@/src/context/routeContext';
import DateTimePicker from '@react-native-community/datetimepicker'
import PickerModal from '@/src/components/ui/pickerModal';
import PrimaryButton from '@/src/components/ui/primaryButton';
import FormHeader from '@/src/components/ui/formHeader';
import InputField from '@/src/components/ui/inputField';

export default function routeInfo() {
    const { formData, updateFormData } = useRouteDataForm();
    const [gym, setGym] = useState(formData.gym || '');
    const [grade, setGrade] = useState(formData.grade || '');
    const [date, setDate] = useState(formData.date ? new Date(formData.date) : new Date());
    const [status, setStatus] = useState(formData.status || '');
    const [quality, setQuality] = useState(formData.quality || '');
    const [attempts, setAttempts] = useState(formData.attempts?.toString() || '');
    const [notes, setNotes] = useState(formData.notes || '');
    const [setter, setSetter] = useState(formData.setter || '');
    const [color, setColor] = useState(formData.setter || '');
    const [gradeModalVisible, setGradeModalVisible] = useState(false);
    const [statusModalVisible, setStatusModalVisible] = useState(false);
    const [qualityModalVisible, setQualityModalVisible] = useState(false);
    const [dateModalVisible, setDateModalVisible] = useState(false);

    const boulderStatuses = ['Flash', 'Onsight', 'Project', 'Redpoint']
    const boulderRatings = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5']
    const boulderGrades = [
        'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 
        'V12', 'V13', 'V14', 'V15', 'V16', 'V17'
    ];
    
    const handleNext = () => {
        // Input Validation: 
        const errors = [];
        if (color && !/^[a-zA-Z\s]+$/.test(color)) {
            errors.push('Color should only contain letters');
        }
        if (attempts && (isNaN(Number(attempts)) || Number(attempts) < 1)) {
            errors.push('Attempts must be a positive number');
        }

        if (errors.length > 0) {
            Alert.alert(
                'Please fix the following:', 
                errors.map((e, i) => `${i + 1}. ${e}`).join('\n')
            );
            return;
        }

        updateFormData({ 
            gym,
            grade,
            date: date.toISOString().split('T')[0],
            status: status as 'Flash' | 'Onsight' | 'Project' | 'Redpoint',
            quality: Number(quality),
            attempts: Number(attempts),
            notes,
            setter,
            color,
        })
        router.push('/addRoute/holdData')
    };

    const validInput = grade && gym && date && status && attempts && color;

    return (
        <SafeAreaView className='flex-1 bg-black'>
            <View className='flex-1'>
                <FormHeader step={1} totalSteps={4} title="Boulder Info" />

                <InputField
                    label="Gym"
                    value={gym}
                    onChangeText={setGym}
                    placeholder="Dogpatch Boulders"
                />

                <InputField
                    label="Setter"
                    optional
                    value={setter}
                    onChangeText={setSetter}
                    placeholder="Alexander Megos"
                />

                <InputField
                    label="Color"
                    value={color}
                    onChangeText={setColor}
                    placeholder="Purple"
                />
                
                <PickerModal 
                    header="Boulder Grade"
                    selectedValue={grade}
                    onValueChange={(value) => setGrade(value as string)}
                    visible={gradeModalVisible}
                    onClose={() => setGradeModalVisible(false)}
                    onOpen={() => setGradeModalVisible(true)}
                    placeholder="Select Grade"
                    pickerOptions={boulderGrades}
                />

                <PickerModal 
                    header="Boulder Status"
                    selectedValue={status}
                    onValueChange={(value) => setStatus(value as string)}
                    visible={statusModalVisible}
                    onClose={() => setStatusModalVisible(false)}
                    onOpen={() => setStatusModalVisible(true)}
                    placeholder="Select Status"
                    pickerOptions={boulderStatuses}
                />
                
                <InputField
                    label="Number of Attempts"
                    value={attempts}
                    onChangeText={setAttempts}
                    placeholder="10"
                />

                <PickerModal 
                    header="Boulder Quality"
                    selectedValue={quality.toString()}
                    onValueChange={(value) => setQuality(value as string)}
                    visible={qualityModalVisible}
                    onClose={() => setQualityModalVisible(false)}
                    onOpen={() => setQualityModalVisible(true)}
                    placeholder="Select Rating"
                    pickerOptions={boulderRatings}
                    optional
                />

                <InputField 
                    label="Notes"
                    optional
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="The crux was..."
                    multiline
                    numberOfLines={3}
                />

                <View className='flex flex-row mb-4 items-center justify-center'>
                    <Text className='text-white'>Start Date:</Text>
                    <Pressable  
                        onPress={() => setDateModalVisible(true)} 
                        className='flex items-center justify-center bg-gray-700 rounded-lg'
                    >
                        <Text className='text-white px-4'>{date.toISOString().split('T')[0] || 'Select Date'}</Text>
                    </Pressable>
                </View>
                <Modal
                    visible={dateModalVisible}
                    transparent={true}
                    animationType='slide'
                    onRequestClose={() => setDateModalVisible(false)}
                >   
                    <View className='flex-1 items-center justify-end'>
                        <View className="w-full rounded-lg items-center">
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display="spinner"
                                onChange={(event, selectedDate) => {
                                    if (selectedDate) {
                                        setDate(selectedDate);
                                        updateFormData({ date: selectedDate.toISOString() });
                                    }
                                }}
                                textColor="white"
                                accentColor="#007AFF"
                                themeVariant="dark"
                            />

                            <View className="flex items-center p-4">
                                <Pressable onPress={() => setDateModalVisible(false)}>
                                    <Text className="text-blue-500 text-lg font-semibold">Done</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
                
                <PrimaryButton
                    title="Add Route Info"
                    onPress={handleNext}
                    disabled={!validInput}
                />
            </View>
        </SafeAreaView>
    )
}