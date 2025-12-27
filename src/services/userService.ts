import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebaseConfig";
import { UserProfile } from "../types/userProfile";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export async function getUserProfile(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    return null;
  }
}

export async function createUserProfile(uri: string | null, data: UserProfile) {
  let profilePictureUrl;

  // Convert profile picture uri to blob then store in firestorage
  if (uri) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `profilePictures/${data.id}.jpg`);
    await uploadBytes(storageRef, blob);

    // Get the download Url so we can store that in firestore
    profilePictureUrl = await getDownloadURL(storageRef);
  }

  // store data to firestore
  await setDoc(doc(db, "users", data.id), {
    createdAt: new Date().toISOString(),
    ...data,
    profilePicture: profilePictureUrl,
  });
}