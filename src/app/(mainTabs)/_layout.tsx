import { Tabs } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function MainTabsLayout() {
  return (
        <Tabs screenOptions={{ tabBarActiveTintColor: "red"}}>
            <Tabs.Screen 
              name="home" 
              options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons 
                    name="home" 
                    size={size} 
                    color={color}
                  />
                ),
              }}
            />
            <Tabs.Screen 
              name="profile" 
              options={{
                tabBarShowLabel: false,
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons 
                    name="account-circle" 
                    size={size} 
                    color={color}
                  />
                ),
              }}
            />
        </Tabs>
  );
}