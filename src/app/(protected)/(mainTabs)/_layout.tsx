import { Tabs } from 'expo-router';

export default function MainTabsLayout() {
  return (
        <Tabs>
            <Tabs.Screen name="home" />
            <Tabs.Screen name="profile" />
        </Tabs>
  );
}