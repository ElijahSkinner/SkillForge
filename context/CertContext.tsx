// app/context/CertContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CertContextType = {
    selectedCert: string | null;
    setSelectedCert: (cert: string) => void;
};

const CertContext = createContext<CertContextType | null>(null);

export const useCert = () => {
    const context = useContext(CertContext);
    if (!context) throw new Error('useCert must be used within CertProvider');
    return context;
};

export const CertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCert, setSelectedCertState] = useState<string | null>(null);

    useEffect(() => {
        // Load persisted cert
        const loadCert = async () => {
            const saved = await AsyncStorage.getItem('selectedCert');
            if (saved) setSelectedCertState(saved);
        };
        loadCert();
    }, []);

    const setSelectedCert = async (cert: string) => {
        setSelectedCertState(cert);
        await AsyncStorage.setItem('selectedCert', cert);
    };

    return (
        <CertContext.Provider value={{ selectedCert, setSelectedCert }}>
            {children}
        </CertContext.Provider>
    );
};
