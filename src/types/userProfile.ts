export interface userProfile {
    // Required
    id: string;
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