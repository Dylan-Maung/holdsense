import { createContext, useState, useContext } from 'react';
import { OnboardingForm } from '../types/onboarding';

type OnboardingContextType = {
    formData: OnboardingForm;
    updateFormData: (data: Partial<OnboardingForm>) => void;
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: {children: React.ReactNode })  => {
    const [formData, setFormData] = useState<OnboardingForm>({});
    const updateFormData = (data: Partial<OnboardingForm>) => {
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