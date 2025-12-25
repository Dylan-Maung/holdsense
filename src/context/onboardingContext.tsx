import { createContext, useState, useContext } from 'react';
import { onBoardingForm } from '../types/onboarding';

type OnboardingContextType = {
    formData: onBoardingForm;
    updateFormData: (data: Partial<onBoardingForm>) => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: {children: React.ReactNode })  => {
    const [formData, setFormData] = useState<onBoardingForm>({});
    const updateFormData = (data: Partial<onBoardingForm>) => {
        setFormData(prev => ({ ...prev, ...data }));
    }
    return (
        <OnboardingContext.Provider 
            value={{ 
                formData, 
                updateFormData
            }}
        >
            {children}
        </OnboardingContext.Provider>
    )
};

export const useOnboarding = ()  => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};