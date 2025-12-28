import { createContext, useState, useContext } from 'react';
import { RouteData, RouteDataForm } from '../types/routeData';

type RouteDataFormContextType = {
    formData: RouteDataForm;
    updateFormData: (data: RouteDataForm) => void;
};

const RouteDataFormContext = createContext<RouteDataFormContextType | undefined>(undefined);

export const RouteDataProvider = ({ children }: {children: React.ReactNode })  => {
    const [formData, setFormData] = useState<RouteDataForm>({});
    const updateFormData = (data: RouteDataForm) => {
        setFormData(prev => ({ ...prev, ...data }));
    }
    return (
        <RouteDataFormContext.Provider 
            value={{ 
                formData, 
                updateFormData
            }}
        >
            {children}
        </RouteDataFormContext.Provider>
    )
};

export const useRouteDataForm = ()  => {
    const context = useContext(RouteDataFormContext);
    if (!context) {
        throw new Error("useRouteData must be used within an RouteDataProvider");
    }
    return context;
};