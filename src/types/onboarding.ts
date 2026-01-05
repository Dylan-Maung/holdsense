export interface OnboardingForm {
    // onboarding/profile.tsx
    username?: string;
    bio?: string; // Optional

    // onboarding/anthropometry.tsx
    height?: number;
    reach?: number;

    // onboarding/climbing.tsx
    homeGym?: string;
    grade?: string;

    // onboarding/picture.tsx
    profilePicture?: string;
}