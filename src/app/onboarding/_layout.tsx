import { OnboardingProvider } from "@/src/context/onboardingContext";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
    return (
        <OnboardingProvider>
            <Stack screenOptions={{ headerShown: false }}/>
        </OnboardingProvider>
    )
}