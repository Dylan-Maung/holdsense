export interface UserProfile {
    // Required
    id: string; // google OAuth Sub
    uid: string; // Firebase UID
    name: string;
    username: string;
    email: string;

    // Optional
    profilePicture?: string;
    bio?: string;
    homeGym?: string;
    height?: number;
    reach?: number;
    grade?: string;
}