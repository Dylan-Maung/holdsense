import { BASE_URL } from '@/lib/constants';
import React from 'react';
import { Button, Text, View } from 'react-native';
import LoginForm from '../../../components/LoginForm';
import { useAuth } from '../../../context/auth';
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { db } from '@/lib/firebaseConfig';
import { Alert } from 'react-native';

export default function home() {
  const { user, signOut, fetchWithAuth } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  async function createUserViaAPI() {
    try {
      const response = await fetchWithAuth(`${BASE_URL}/api/test`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first: "Ethan",
          middle: "",
          last: "Lin",
          born: 1912
        })
      });

      const responseData = await response.json() as {
        success: boolean;
        message?: string;
        userId?: string;
        error?: string;
      };
      
      console.log('API Response:', responseData);
      
      if (responseData.success) {
        Alert.alert('Success', `User created with ID: ${responseData.userId}`);
      } else {
        Alert.alert('Error', responseData.error || 'Unknown error');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Error', 'Failed to create user');
    }
  }

  async function firebaseTest() {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Ada",
        last: "Lovelace",
        born: 1815
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function firebaseTestTwo() {
    // Add a second document with a generated ID.
    try {
      const docRef = await addDoc(collection(db, "users"), {
        first: "Henry",
        middle: "",
        last: "Yu",
        born: 1912
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async function firebaseTestThree() {
    // Add a second document with a generated ID.
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  }

  return (
    <View className='flex-1 bg-red-400'>
      <Text>Welcome {user.name}</Text>
      <Button title="Sign Out" onPress={signOut}/>
      <Button title="createUserViaAPI" onPress={createUserViaAPI}/>
      <Button title="Client FireBase Test One" onPress={firebaseTestTwo}/>
      <Button title="Client FireBase Test One" onPress={firebaseTestThree}/>
    </View>
  )
}
