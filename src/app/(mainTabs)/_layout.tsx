import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View } from 'react-native';

export default function MainTabsLayout() {
  return (
        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor: "red",  
            tabBarLabelPosition: "below-icon", 
            tabBarBackground: () => <View style={{ backgroundColor: '#000', flex: 1 }} />,
            tabBarStyle: {
              backgroundColor: '#000',
              borderTopWidth: 0,
            }
          }}
        >
            <Tabs.Screen 
              name="home" 
              options={{
                title: "Home",
                tabBarLabel: "Home",
                tabBarShowLabel: true,
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="home" size={size} color={color} />
                ),
              }}
            />

            <Tabs.Screen 
              name="profile" 
              options={{
                title: "Profile",
                tabBarShowLabel: true,
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="account-circle" size={size} color={color}
                  />
                ),
              }}
            />
        </Tabs>
  );
}