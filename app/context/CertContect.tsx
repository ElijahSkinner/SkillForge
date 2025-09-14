import React, { createContext, useState, useContext } from 'react';

type CertContextType = {
    selectedCert: string | null;
    setSelectedCert: (cert: string) => void;
};

const CertContext = createContext<CertContextType | undefined>(undefined);

export const CertProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedCert, setSelectedCert] = useState<string | null>(null);

    return (
        <CertContext.Provider value={{ selectedCert, setSelectedCert }}>
            {children}
        </CertContext.Provider>
    );
};

export const useCert = () => {
    const context = useContext(CertContext);
    if (!context) throw new Error('useCert must be used within CertProvider');
    return context;
};
