import { RouteDataProvider } from "@/src/context/routeContext";
import { Stack } from "expo-router";

export default function AddRouteLayout() {
    return (
        <RouteDataProvider>
            <Stack screenOptions={{ headerShown: false }}/>
        </RouteDataProvider>
    )
}