import { Hold } from "../types/hold";
import { RouteData } from "../types/routeData";
import { Wall } from "../types/wall";
import { db, storage } from "@/lib/firebaseConfig";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc, getDocs, collection, where, query, orderBy, limit, getDoc } from "firebase/firestore";

export async function createRoute(holds: Hold[], fullRouteImages: Wall[], data: RouteData) {
    // Store holds to firestorage
    const holdsWithUrls = await Promise.all(
        holds.map(async (hold, index) => {
            const response = await fetch(hold.imageUri);
            const blob = await response.blob();
            const storageRef = ref(storage, `routes/${data.userId}/${data.id}/holds/${hold.id}.jpg`);
            await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageRef);
            
            return {
                ...hold,
                imageUri: downloadUrl
            };
        })
    );
    
    // Store walls to firestorage
    const wallsWithUrls = await Promise.all(
        fullRouteImages.map(async (wall) => {
            const response = await fetch(wall.imageUri);
            const blob = await response.blob();
            const storageRef = ref(storage, `routes/${data.userId}/${data.id}/walls/${wall.id}.jpg`);
            await uploadBytes(storageRef, blob);
            const downloadUrl = await getDownloadURL(storageRef);
            
            return {
                ...wall,
                imageUri: downloadUrl
            };
        })
    );
    
    // Store routes to firestorage with holds and wall downloadUrls
    await setDoc(doc(db, "routes", data.id), {
        ...data,
        holds: holdsWithUrls,
        fullRouteImages: wallsWithUrls,
        createdAt: new Date().toISOString(),
    });
}

export async function getUserRoutes(userId: string) {
    const routesRef = collection(db, "routes");
    const q = query(routesRef, where("userId", "==", userId))
    
    const querySnap = await getDocs(q);
    const routes: RouteData[] = [];

    querySnap.forEach((doc) => {
        routes.push(doc.data() as RouteData);
    });
    
    return routes
}

export async function getRecentUserRoutes(userId: string, count: number = 5) {
    const routesRef = collection(db, "routes");
    const q = query(
        routesRef, 
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(count)
    );
    
    const querySnap = await getDocs(q);
    const routes: RouteData[] = [];

    querySnap.forEach((doc) => {
        routes.push(doc.data() as RouteData);
    });
    return routes
}

export async function getRouteById(routeId: string) {
    const routeRef = doc(db, "routes", routeId);
    const routeSnap = await getDoc(routeRef);

    if (routeSnap.exists()) {
        return routeSnap.data() as RouteData;
    } else {
        return null;
    }
}